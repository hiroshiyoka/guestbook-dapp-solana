"use client";

import { useState } from "react";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { TxToast } from "./TxToast";

import { MAX_MESSAGE_LENGTH } from "../lib/constants";
import { useProgram, getGlobalPda, getMessagePda, SystemProgram } from "../lib/anchor/program";

function trimToMaxBytes(value: string, maxBytes: number) {
  if (new TextEncoder().encode(value).length <= maxBytes) return value;
  let result = "";
  for (const character of value) {
    const next = result + character;
    if (new TextEncoder().encode(next).length > maxBytes) break;
    result = next;
  }
  return result;
}

export function MessageComposer() {
  const { publicKey } = useWallet(); const { setVisible } = useWalletModal(); const program = useProgram();
  const [content, setContent] = useState(""); const [status, setStatus] = useState<"pending"|"confirmed"|"failed">(); const [signature, setSignature] = useState<string>(); const [error, setError] = useState<string>();

  async function submit() {
    if (!publicKey) { setVisible(true); return; }
    if (!program || !content.trim() || new TextEncoder().encode(content).length > MAX_MESSAGE_LENGTH) return;
    setStatus("pending"); setError(undefined);

    try {
      const typedProgram = program as any;
      const global = getGlobalPda(program.programId); const state = await typedProgram.account.globalState.fetch(global); const message = getMessagePda(state.messageCount, program.programId);
      const tx = await typedProgram.methods.postMessage(content).accounts({ global, message, author: publicKey, systemProgram: SystemProgram.programId }).rpc();
      setSignature(tx); setStatus("confirmed"); setContent(""); window.dispatchEvent(new Event("guestbook:refresh"));
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); setStatus("failed"); }
  }
  
  const bytes = new TextEncoder().encode(content).length;
  return <>{status && <TxToast signature={signature} status={status} error={error} />}<section className="composer"><div className="composer-head"><label className="label" htmlFor="message">YOUR MESSAGE</label><span className="composer-hint">PUBLIC NOTE</span></div><textarea id="message" value={content} onChange={e => setContent(trimToMaxBytes(e.target.value, MAX_MESSAGE_LENGTH))} placeholder="Leave a message..." /><div className="composer-bottom"><span className={`counter ${bytes >= MAX_MESSAGE_LENGTH - 20 ? "near-limit" : ""}`} aria-live="polite">{bytes}/{MAX_MESSAGE_LENGTH} BYTES</span><button className="post-button" onClick={submit} disabled={!!publicKey && (!content.trim() || bytes > MAX_MESSAGE_LENGTH)} aria-disabled={!!publicKey && (!content.trim() || bytes > MAX_MESSAGE_LENGTH)}>{publicKey ? "Sign & Post" : "Connect Wallet to Post"}<span aria-hidden="true">↗</span></button></div></section></>;
}
