"use client";

import { AnchorProvider, BN, Program, type Idl } from "@coral-xyz/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "./idl.json";
import { PROGRAM_ID } from "../constants";

export function useProgram() {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  if (!wallet) return null;
  return new Program(idl as unknown as Idl, new AnchorProvider(connection, wallet, { commitment: "confirmed" }));
}

export function getGlobalPda(programId = PROGRAM_ID) {
  return PublicKey.findProgramAddressSync([Buffer.from("global")], programId)[0];
}

export function getMessagePda(index: number | import("@coral-xyz/anchor").BN, programId = PROGRAM_ID) {
  const value = typeof index === "number" ? new BN(index) : index;
  return PublicKey.findProgramAddressSync([Buffer.from("message"), value.toArrayLike(Buffer, "le", 8)], programId)[0];
}

export { SystemProgram };
