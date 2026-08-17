import * as anchor from "@coral-xyz/anchor";
import { assert } from "chai";
import { Guestbook } from "../target/types/guestbook";

describe("guestbook", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.guestbook as anchor.Program<Guestbook>;
  const payer = provider.wallet;
  const systemProgram = anchor.web3.SystemProgram.programId;
  const [global] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("global")],
    program.programId,
  );

  const messagePda = (index: number) =>
    anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("message"), new anchor.BN(index).toArrayLike(Buffer, "le", 8)],
      program.programId,
    )[0];

  it("initializes global state at zero", async () => {
    await program.methods.initializeGlobal().accounts({
      global,
      payer: payer.publicKey,
      systemProgram,
    }).rpc();

    const account = await program.account.globalState.fetch(global);
    assert.equal(account.messageCount.toNumber(), 0);
  });

  it("posts a message with author, content, index, and timestamp", async () => {
    const before = Math.floor(Date.now() / 1000);
    await program.methods.postMessage("hello from Solana").accounts({
      global,
      message: messagePda(0),
      author: payer.publicKey,
      systemProgram,
    }).rpc();

    const account = await program.account.messageAccount.fetch(messagePda(0));
    assert.equal(account.author.toBase58(), payer.publicKey.toBase58());
    assert.equal(account.content, "hello from Solana");
    assert.equal(account.index.toNumber(), 0);
    assert.isAtLeast(account.timestamp.toNumber(), before - 5);
    assert.isAtMost(account.timestamp.toNumber(), Math.floor(Date.now() / 1000) + 5);
    assert.equal((await program.account.globalState.fetch(global)).messageCount.toNumber(), 1);
  });

  it("lets another wallet post at the next index", async () => {
    const author = anchor.web3.Keypair.generate();
    const airdrop = await provider.connection.requestAirdrop(author.publicKey, anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(airdrop);

    await program.methods.postMessage("second author").accounts({
      global,
      message: messagePda(1),
      author: author.publicKey,
      systemProgram,
    }).signers([author]).rpc();

    const account = await program.account.messageAccount.fetch(messagePda(1));
    assert.equal(account.author.toBase58(), author.publicKey.toBase58());
    assert.equal(account.index.toNumber(), 1);
    assert.equal((await program.account.globalState.fetch(global)).messageCount.toNumber(), 2);
  });

  it("rejects empty and whitespace-only messages", async () => {
    for (const content of ["", "   \n\t"]) {
      try {
        await program.methods.postMessage(content).accounts({
          global, message: messagePda(2), author: payer.publicKey, systemProgram,
        }).rpc();
        assert.fail("empty message should fail");
      } catch (error) {
        assert.include(String(error), "Message must not be empty");
      }
    }
  });

  it("rejects content over 280 UTF-8 bytes", async () => {
    try {
      await program.methods.postMessage("a".repeat(281)).accounts({
        global, message: messagePda(2), author: payer.publicKey, systemProgram,
      }).rpc();
      assert.fail("long message should fail");
    } catch (error) {
      assert.include(String(error), "Message exceeds the 280 character limit");
    }
  });

  it("returns all message accounts", async () => {
    const messages = await program.account.messageAccount.all();
    assert.lengthOf(messages, 2);
    assert.sameMembers(messages.map(({ account }) => account.content), ["hello from Solana", "second author"]);
  });
});
