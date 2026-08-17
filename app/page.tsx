import { ConnectButton } from "../components/ConnectButton";
import { MessageComposer } from "../components/MessageComposer";
import { MessageFeed } from "../components/MessageFeed";

export default function Home() {
  return <main className="shell">
    <header className="site-header">
      <div className="brand"><div><p className="eyebrow">PUBLIC LEDGER / DEVNET</p><h1>Guestbook<span>_</span></h1></div></div>
      <ConnectButton />
    </header>
    <div className="workspace">
      <section className="left-column">
        <section className="intro"><div className="intro-top"><p className="kicker">WRITE ONCE. STAYS FOREVER.</p><span className="live-pill"><i />LIVE</span></div><p className="lede">A shared, permanent guestbook on Solana. Leave a note for whoever comes next.</p></section>
        <MessageComposer />
        <p className="aside-note"><span className="aside-rule" />Every entry is signed by a wallet and stored permanently on-chain.</p>
      </section>
      <MessageFeed />
    </div>
    <footer className="footer">Messages live on-chain. No edits. No deletes.</footer>
  </main>;
}
