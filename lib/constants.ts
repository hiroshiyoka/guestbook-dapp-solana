import { PublicKey } from "@solana/web3.js";

export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT ?? "https://api.devnet.solana.com";
export const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID ?? "11111111111111111111111111111111");
export const CLUSTER = process.env.NEXT_PUBLIC_CLUSTER ?? "devnet";
export const MAX_MESSAGE_LENGTH = Number(process.env.NEXT_PUBLIC_MAX_MESSAGE_LENGTH ?? 280);
export const EXPLORER_BASE = `https://explorer.solana.com`;
