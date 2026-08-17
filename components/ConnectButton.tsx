"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";

export function ConnectButton() {
  const { publicKey } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <button className="connect connect-placeholder" aria-hidden="true" tabIndex={-1} />;
  if (!publicKey) return <WalletMultiButton className="connect" />;
  return <WalletMultiButton className="connect connected"><span className="dot" />{publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</WalletMultiButton>;
}
