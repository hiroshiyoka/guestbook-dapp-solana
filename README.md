# Guestbook On-chain

30 Days, 30 Simple Smart Contract Projects

Day 2 / Project 2

Guestbook On-chain is a small Solana dApp where any connected wallet can post a short, permanent message to a shared public feed. Messages are stored on-chain and can never be edited or deleted.

Project tagline: **Write once. Stays forever.**

This project continues a personal challenge to build 30 simple smart contract projects in 30 days. Each project focuses on one small on-chain concept, with practical implementation, testing, and frontend integration where useful.

This is a learning and portfolio project demonstrating:

    Rust and Anchor program development
    Solana PDAs and deterministic account creation
    Variable-length UTF-8 string storage on-chain
    TypeScript Anchor integration tests
    Growing append-only account collections
    Next.js and Solana Wallet Adapter integration

## Scope

Guestbook uses one shared `GlobalState` account and one `MessageAccount` PDA per message.

The global account is derived from:

```text
["global"]
```

Each message account is derived from:

```text
["message", message_index.to_le_bytes()]
```

`GlobalState` stores the total message count. The count also becomes the index and PDA seed for the next message.

Each `MessageAccount` stores:

| Field | Type | Description |
|---|---|---|
| author | Pubkey | Wallet that posted the message |
| content | String | UTF-8 message content, maximum 280 bytes |
| timestamp | i64 | Unix timestamp from the Solana Clock sysvar |
| index | u64 | Global message position, starting at zero |

Program instructions:

    initialize_global: creates the single GlobalState PDA with message_count = 0
    post_message: creates a new MessageAccount and increments message_count

Messages must not be empty after trimming and must not exceed 280 UTF-8 bytes.

There are intentionally no edit or delete instructions. No backend, moderation tooling, likes, replies, threading, off-chain message storage, or mainnet deployment is included in v1.

## Architecture

Next.js frontend
        |
        | wallet adapter + RPC
        v
Solana Devnet / Anchor program
        |
        +-- one GlobalState PDA
        |
        +-- one MessageAccount PDA per message

The frontend communicates directly with Solana RPC. No traditional REST or GraphQL API is required.

## Project Structure

```text
guestbook-app/
├── programs/
│   └── guestbook/
│       ├── src/lib.rs
│       └── Cargo.toml
├── tests/
│   └── guestbook.ts
├── app/                      # Next.js App Router, no src/ folder
│   ├── layout.tsx
│   ├── page.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── ConnectButton.tsx
│   ├── MessageCard.tsx
│   ├── MessageComposer.tsx
│   ├── MessageFeed.tsx
│   └── TxToast.tsx
├── lib/
│   ├── anchor/
│   │   ├── idl.json
│   │   ├── program.ts
│   │   └── types.ts
│   └── constants.ts
├── docs/                    # local specifications; excluded from Git
├── Anchor.toml
├── Cargo.toml
├── package.json
├── tsconfig.json
└── next.config.ts
```

The frontend structure is:

```text
app/                         # Next.js App Router, no src/ folder
components/
lib/anchor/
public/
```

## Program Details

The program ID is currently a placeholder:

```text
11111111111111111111111111111111
```

The final program ID must be recorded consistently in `declare_id!()`, `Anchor.toml`, and the frontend environment configuration after deployment.

The program has not been deployed to Devnet yet.

Account space:

```text
GlobalState:
8 discriminator + 8 message_count = 16 bytes

MessageAccount:
8 discriminator + 32 author + 4 string length prefix + 280 content
+ 8 timestamp + 8 index = 340 bytes
```

`post_message` requires the author wallet signer. Anchor validates both PDAs through account seeds. The message index is assigned from `GlobalState.message_count`, then the counter increments using checked arithmetic.

## Requirements

For local program development:

    Rust and Cargo
    Solana CLI
    Anchor CLI 0.32.1
    Node.js and npm or Yarn
    A Solana keypair configured as the Anchor provider wallet

Check installations:

```bash
rustc --version
cargo --version
solana --version
anchor --version
node --version
npm --version
```

## Install Dependencies

Install the JavaScript dependencies after the frontend is scaffolded:

```bash
npm install
```

The complete Anchor test toolchain must be available before running tests. The project test script uses Anchor's TypeScript test runner.

## Local Development

Start a local validator in a separate terminal:

```bash
solana-test-validator
```

Build the program:

```bash
anchor build
```

Run the test suite:

```bash
anchor test
```

The tests cover:

    GlobalState initialization with message_count = 0
    Message creation with author, content, index, and timestamp
    Message count incrementing after successful posts
    Two different wallets posting distinct messages
    Empty and whitespace-only message rejection
    Message rejection above 280 UTF-8 bytes
    Fetching all MessageAccount accounts

## Devnet Deployment

Deployment is not completed yet. After local tests pass and the provider wallet has Devnet SOL:

```bash
solana config set --url devnet
solana balance
anchor build
anchor deploy --provider.cluster devnet
anchor keys list
```

After deployment, replace the placeholder program ID in:

1. `declare_id!()` in `programs/guestbook/src/lib.rs`
2. `[programs.devnet]` in `Anchor.toml`
3. `NEXT_PUBLIC_PROGRAM_ID` in the frontend `.env.local`

Initialize the global state exactly once per cluster after deployment. This is a one-time bootstrap operation, not part of normal message posting.

The frontend will use:

```dotenv
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<program_id_from_deploy>
NEXT_PUBLIC_CLUSTER=devnet
NEXT_PUBLIC_MAX_MESSAGE_LENGTH=280
```

The generated IDL should be copied from `target/idl/guestbook.json` to `lib/anchor/idl.json` after the program is built.

## Documentation

Detailed product, technical, design, and data specifications are kept in `/docs` locally. The directory is excluded by `.gitignore`.

Phase 1 source implementation is complete. The Anchor program and test suite are present, and `cargo check` passes. Frontend implementation, Devnet deployment, global-state bootstrap, and generated IDL integration remain pending.

At the time of writing, `anchor`, `solana`, and `solana-keygen` are not available on `PATH` in the development environment. Therefore, `anchor build` and `anchor test` require the Solana and Anchor toolchain to be installed first.

## License

Portfolio/learning project.
