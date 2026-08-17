"use client";

import { CLUSTER, EXPLORER_BASE } from "../lib/constants";

export function TxToast({ signature, status, error }: { signature?: string; status: "pending" | "confirmed" | "failed"; error?: string }) {
  return <div className="toast" role="status">{status === "pending" && "Waiting for confirmation..."}{status === "confirmed" && <>Message posted. <a href={`${EXPLORER_BASE}/tx/${signature}?cluster=${CLUSTER}`} target="_blank" rel="noreferrer">View transaction</a></>}{status === "failed" && `Transaction failed: ${error ?? "Unknown error"}`}</div>;
}
