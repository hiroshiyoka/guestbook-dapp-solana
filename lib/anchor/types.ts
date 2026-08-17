export type GuestbookMessage = {
  publicKey: import("@solana/web3.js").PublicKey;
  account: { author: import("@solana/web3.js").PublicKey; content: string; timestamp: import("@coral-xyz/anchor").BN; index: import("@coral-xyz/anchor").BN };
};
