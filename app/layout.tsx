import type { Metadata } from "next";
import { Bricolage_Grotesque, Space_Mono, Syne } from "next/font/google";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./globals.css";
import { Providers } from "./providers";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage" });

export const metadata: Metadata = {
  title: "Guestbook On-chain",
  description: "Write once. Stays forever.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${syne.variable} ${spaceMono.variable} ${bricolage.variable}`}><Providers>{children}</Providers></body></html>;
}
