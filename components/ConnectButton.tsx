"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export function ConnectButton() {
  const { publicKey } = useWallet();
  if (!publicKey) return <WalletMultiButton className="connect" />;
  return <WalletMultiButton className="connect connected"><span className="dot" />{publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</WalletMultiButton>;
}
