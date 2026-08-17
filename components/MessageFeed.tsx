"use client";

import { useCallback, useEffect, useState } from "react";

import { useConnection } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, type Idl } from "@coral-xyz/anchor";

import { MessageCard } from "./MessageCard";

import idl from "../lib/anchor/idl.json";
import { PROGRAM_ID } from "../lib/constants";
import type { GuestbookMessage } from "../lib/anchor/types";

export function MessageFeed() { const { connection } = useConnection(); const [messages, setMessages] = useState<GuestbookMessage[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState<string>();
  const load = useCallback(async () => { try { setError(undefined); const program = new Program(idl as unknown as Idl, new AnchorProvider(connection, {} as never, { commitment: "confirmed" })); const items = await (program as any).account.messageAccount.all() as GuestbookMessage[]; setMessages(items.sort((a, b) => b.account.index.cmp(a.account.index))); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setLoading(false); } }, [connection]);
  useEffect(() => { void load(); const handler = () => void load(); window.addEventListener("guestbook:refresh", handler); const timer = window.setInterval(load, 15000); return () => { window.removeEventListener("guestbook:refresh", handler); window.clearInterval(timer); }; }, [load]);
  return <section className="feed"><div className="feed-heading"><div><p className="feed-label">THE WALL</p><h2>Recent entries <span>/ {messages.length}</span></h2></div><button className="refresh" onClick={() => void load()}><span aria-hidden="true">↻</span> REFRESH</button></div>{loading ? <p className="loading">Reading the ledger...</p> : error ? <p className="error">Unable to load messages. {error}</p> : messages.length === 0 ? <p className="empty">No entries yet - be the first to write something that lasts.</p> : <div className="message-list">{messages.map(message => <MessageCard key={message.publicKey.toBase58()} message={message} />)}</div>}</section>;
}
