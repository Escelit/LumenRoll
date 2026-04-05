# LumenRoll

A provably fair, on-chain dice game built on Stellar using Soroban smart contracts. Players bet XLM (or any Stellar custom asset) on a dice roll outcome. Fairness is guaranteed through a commit-reveal randomness scheme — neither the player nor the house can manipulate the result after a bet is placed.

> **Status:** Active development · Testnet ready · Mainnet pending audit  
> **Network:** Stellar Testnet / Mainnet  
> **Stack:** Rust (Soroban) · Node.js · React · Stellar SDK

---

## Table of contents

- [How it works](#how-it-works)
- [Provably fair randomness](#provably-fair-randomness)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Smart contract](#smart-contract)
  - [Contract API](#contract-api)
  - [Data types](#data-types)
  - [Error codes](#error-codes)
  - [Constants](#constants)
  - [Building and deploying](#building-and-deploying)
- [Backend API](#backend-api)
  - [Environment variables](#environment-variables)
  - [Endpoints](#endpoints)
  - [Running locally](#running-locally)
- [Frontend](#frontend)
  - [Wallet integration](#wallet-integration)
  - [Running locally](#running-locally-1)
- [Game flow walkthrough](#game-flow-walkthrough)
- [Token configuration](#token-configuration)
- [House bankroll management](#house-bankroll-management)
- [Security model](#security-model)
- [Testing](#testing)
- [Deployment checklist](#deployment-checklist)
- [Contributing](#contributing)
- [License](#license)

---

## How it works

LumenRoll is a 1-vs-house dice game. A player picks a number between 1 and 6 and wagers an amount of XLM. If the dice lands on their number, they win **5× their bet** (reflecting the true 1-in-6 odds with a small house edge baked into the payout multiplier). If not, the house keeps the bet.

The game runs across four on-chain phases:

| Phase                 | Action                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| 1 — Player commits    | `hash(player_secret + bet_amount + guess)` + locks escrow                                           |
| 2 — House commits     | `hash(house_secret)` stored on contract                                                             |
| 3 — Both reveal       | Secrets submitted, contract verifies hashes                                                         |
| 4 — Contract resolves | `seed = XOR(player_secret, house_secret)` → `dice = (seed % 6) + 1` → payout released automatically |

All state transitions happen via Soroban contract invocations. The frontend and backend never touch escrowed funds directly — only the contract logic does.

---

## Provably fair randomness

The randomness mechanism is a **dual commit-reveal scheme**:

1. Before a bet is placed, the player generates a cryptographically random secret (`player_secret`) client-side and computes `player_commit = sha256(player_secret)`.
2. The player submits their guess, bet amount, and `player_commit` to the contract. The XLM is locked in escrow on-chain.
3. The house backend responds by generating its own `house_secret` and submitting `house_commit = sha256(house_secret)` to the contract.
4. Both parties then submit their raw secrets. The contract verifies each secret against its stored hash.
5. The final seed is derived as `seed = player_secret XOR house_secret`, and the dice result is `(seed % 6) + 1`.

**Why this is fair:**

- The player commits before the house commits, so the house cannot pick a secret that favours itself given knowledge of the player's secret.
- The house commits before either party reveals, so the player cannot choose a secret that exploits knowledge of the house's secret.
- Once both parties have committed, the outcome is deterministic and neither can change it.
- Every step is verifiable on-chain. Anyone can re-derive the result from the two revealed secrets.

**Griefing protection:** If either party fails to reveal within `EXPIRY_LEDGERS` (60 ledgers, ~5 minutes), the non-revealing party is penalised and the other is refunded in full. This prevents a losing party from simply not revealing.

---

## Repository structure

```
LumenRoll/
├── contract/                   # Soroban smart contract (Rust)
│   ├── src/
│   │   └── lib.rs              # Contract logic
│   ├── Cargo.toml
│   └── Makefile                # build / test / deploy helpers
│
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── index.js            # Express app entrypoint
│   │   ├── routes/
│   │   │   ├── bet.js          # POST /bet, GET /bet/:id
│   │   │   └── house.js        # House commit / reveal automation
│   │   ├── services/
│   │   │   ├── stellar.js      # Stellar SDK helpers
│   │   │   ├── contract.js     # Soroban contract invocation helpers
│   │   │   └── randomness.js   # House secret generation + storage
│   │   └── db/
│   │       └── schema.sql      # PostgreSQL schema
│   ├── .env.example
│   └── package.json
│
├── frontend/                   # React application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── DiceBoard.jsx   # Main game UI
│   │   │   ├── BetForm.jsx     # Guess + amount input
│   │   │   ├── DiceRoll.jsx    # Animated dice result
│   │   │   ├── History.jsx     # Past bets table
│   │   │   └── WalletButton.jsx
│   │   ├── hooks/
│   │   │   ├── useFreighter.js # Freighter wallet hook
│   │   │   └── useGame.js      # Game state machine hook
│   │   └── lib/
│   │       ├── stellar.js      # SDK client config
│   │       └── commit.js       # Client-side commit generation
│   ├── .env.example
│   └── package.json
│
├── scripts/
│   ├── deploy.sh               # End-to-end testnet deploy
│   ├── fund-house.sh           # Fund house bankroll
│   └── verify-game.sh          # Verify a game result by game_id
│
└── README.md
```

---

## Prerequisites

| Tool                            | Version | Purpose                                    |
| ------------------------------- | ------- | ------------------------------------------ |
| Rust                            | 1.74+   | Soroban contract compilation               |
| `wasm32-unknown-unknown` target | —       | `rustup target add wasm32-unknown-unknown` |
| Stellar CLI                     | 0.9+    | Deploy and invoke contracts                |
| Node.js                         | 18+     | Backend and frontend                       |
| PostgreSQL                      | 14+     | Backend game state persistence             |
| Freighter                       | latest  | Browser wallet for the frontend            |

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/your-org/LumenRoll.git
cd LumenRoll

# 2. Build and deploy the contract to testnet
cd contract
make deploy-testnet
# Outputs: CONTRACT_ID=C...

# 3. Start the backend
cd ../backend
cp .env.example .env
# Edit .env with your CONTRACT_ID, house keypair, and DB credentials
npm install
npm run migrate
npm run dev

# 4. Start the frontend
cd ../frontend
cp .env.example .env
# Edit .env with VITE_CONTRACT_ID and VITE_API_URL
npm install
npm run dev
```

Open http://localhost:5173, connect Freighter (set to Testnet), and place a bet.

---

## Smart contract

### Contract API

All functions are invokable via Stellar CLI or the Stellar SDK's `SorobanClient`.

#### `initialize(house: Address, token: Address) → Result<(), DiceError>`

One-time setup. Sets the house account and the accepted token (use the Stellar native XLM contract address for XLM bets, or any issued asset's contract address for custom tokens).

Can only be called once. Subsequent calls return `AlreadyInitialized`.

```bash
stellar contract invoke \
  --id $CONTRACT_ID \
  --source $DEPLOYER_SECRET \
  -- initialize \
  --house $HOUSE_ADDRESS \
  --token $TOKEN_ADDRESS
```

#### `place_bet(player, bet_amount, player_guess, player_commit) → Result<u64, DiceError>`

Called by the player to open a game. Requires the player's Stellar account authorization (enforced via `require_auth()`).

| Parameter       | Type         | Description                                     |
| --------------- | ------------ | ----------------------------------------------- |
| `player`        | `Address`    | Player's Stellar account                        |
| `bet_amount`    | `i128`       | Amount in stroops (minimum 1,000,000 = 0.1 XLM) |
| `player_guess`  | `u32`        | Predicted dice outcome, 1–6 inclusive           |
| `player_commit` | `BytesN<32>` | `sha256(player_secret)` computed client-side    |

Returns a `game_id` (incrementing `u64`) that identifies the game for all subsequent calls. The contract transfers `bet_amount` from the player's account to the contract escrow on invocation.

#### `house_commit(game_id: u64, house_commit: BytesN<32>) → Result<(), DiceError>`

Called by the house backend after `place_bet`. Stores the house's commitment. Only the address set during `initialize` may call this.

| Parameter      | Type         | Description                |
| -------------- | ------------ | -------------------------- |
| `game_id`      | `u64`        | ID returned by `place_bet` |
| `house_commit` | `BytesN<32>` | `sha256(house_secret)`     |

After this call the game enters `WaitingForReveal` status.

#### `reveal(game_id, player_secret, house_secret) → Result<DiceResult, DiceError>`

The reveal phase. Can be called by either the player or the house — whoever submits both secrets triggers resolution. In practice the backend automates this once it receives the player's secret via the API.

| Parameter       | Type         | Description                  |
| --------------- | ------------ | ---------------------------- |
| `game_id`       | `u64`        | Target game                  |
| `player_secret` | `BytesN<32>` | Raw player secret (32 bytes) |
| `house_secret`  | `BytesN<32>` | Raw house secret (32 bytes)  |

The contract:

1. Verifies `sha256(player_secret) == stored player_commit`
2. Verifies `sha256(house_secret) == stored house_commit`
3. Computes `seed = player_secret XOR house_secret` (byte-wise)
4. Computes `result = (first_byte_of_seed % 6) + 1`
5. Transfers payout to the player if they won, or releases escrow to the house if they lost
6. Sets game status to `Resolved`

Returns a `DiceResult` struct with `{ roll: u32, won: bool, payout: i128 }`.

#### `claim_expired(game_id: u64) → Result<(), DiceError>`

If the house fails to commit or either party fails to reveal within `EXPIRY_LEDGERS` ledgers, any party can call this to trigger expiry handling:

- If house never committed → full refund to player
- If reveal never happened → refund to player (house is penalised for not revealing)

This protects players from a house that goes offline or attempts to withhold a reveal on a losing outcome.

#### `get_game(game_id: u64) → Option<Game>`

Read-only. Returns the full `Game` struct for a given ID, or `None` if it does not exist.

#### `get_house() → Address`

Returns the configured house address.

#### `get_token() → Address`

Returns the configured token contract address.

---

### Data types

```rust
pub struct Game {
    pub player: Address,
    pub bet_amount: i128,
    pub player_guess: u32,
    pub player_commit: BytesN<32>,
    pub house_commit: BytesN<32>,
    pub status: GameStatus,
    pub ledger_committed: u32,
}

pub enum GameStatus {
    WaitingForHouseCommit,
    WaitingForReveal,
    Resolved,
    Expired,
}

pub struct DiceResult {
    pub roll: u32,
    pub won: bool,
    pub payout: i128,
}
```

---

### Error codes

| Code                 | Value | Meaning                                          |
| -------------------- | ----- | ------------------------------------------------ |
| `AlreadyInitialized` | 1     | `initialize` called more than once               |
| `InvalidGuess`       | 2     | `player_guess` is not 1–6                        |
| `GameNotFound`       | 3     | No game exists for the given `game_id`           |
| `NotHouse`           | 4     | Caller is not the house address                  |
| `WrongPhase`         | 5     | Function called in incorrect game status         |
| `CommitMismatch`     | 6     | Revealed secret does not match stored commitment |
| `GameExpired`        | 7     | `EXPIRY_LEDGERS` elapsed without resolution      |
| `InsufficientBet`    | 8     | `bet_amount` is below `MIN_BET`                  |

---

### Constants

| Constant          | Value             | Notes                             |
| ----------------- | ----------------- | --------------------------------- |
| `MIN_BET`         | 1,000,000 stroops | 0.1 XLM                           |
| `EXPIRY_LEDGERS`  | 60                | ~5 minutes at 5s/ledger           |
| Payout multiplier | 5×                | Reflects 1-in-6 odds + house edge |

The house edge is approximately **16.7%** (true odds pay 6×, this contract pays 5×). Adjust the multiplier in `lib.rs` to tune the edge before deployment.

---

### Building and deploying

```bash
cd contract

# Build optimised WASM
make build
# Output: target/wasm32-unknown-unknown/release/dice_contract.wasm

# Run unit tests
make test

# Deploy to testnet (requires STELLAR_CLI configured with a funded account)
make deploy-testnet
# Exports CONTRACT_ID

# Deploy to mainnet
make deploy-mainnet
```

The Makefile wraps `stellar contract build`, `stellar contract optimize`, and `stellar contract deploy`. Review it before running on mainnet.

---

## Backend API

The backend is a Node.js / Express server that:

- Watches for new `place_bet` contract events via the Stellar event streaming API
- Automatically submits `house_commit` for each new game
- Receives the player's revealed secret, then calls `reveal` on the contract
- Persists game history to PostgreSQL
- Exposes a REST API for the frontend

### Environment variables

Copy `.env.example` to `.env` and fill in all values:

```env
# Stellar
STELLAR_NETWORK=testnet                         # testnet | mainnet
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
CONTRACT_ID=C...                                # Deployed contract address
HOUSE_SECRET_KEY=S...                           # House Stellar secret key (keep safe)
TOKEN_CONTRACT_ID=...                           # Native XLM contract or custom asset

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/stellar_dice

# App
PORT=3001
CORS_ORIGIN=http://localhost:5173
SECRET_STORE_ENCRYPTION_KEY=...                 # AES-256 key for encrypting house secrets at rest
```

> **Important:** The `HOUSE_SECRET_KEY` signs all house transactions. Use a dedicated keypair with only enough XLM to cover transaction fees. Keep the bankroll in a separate account and top up the house contract via `fund-house.sh`.

---

### Endpoints

#### `POST /api/bet`

Opens a new game. The frontend calls this after constructing the player's commitment client-side.

**Request body:**

```json
{
  "player_address": "G...",
  "bet_amount": "10000000",
  "player_guess": 4,
  "player_commit": "a3f2...64 hex chars",
  "signed_xdr": "AAAA..."
}
```

The `signed_xdr` is the player-signed Stellar transaction invoking `place_bet` on the contract. The backend submits it to the network, then immediately fires `house_commit`.

**Response:**

```json
{
  "game_id": "42",
  "status": "waiting_for_reveal",
  "house_committed": true
}
```

#### `POST /api/bet/:game_id/reveal`

The player submits their raw secret to trigger resolution.

**Request body:**

```json
{
  "player_secret": "32-byte hex string"
}
```

The backend looks up the house secret for this game, calls `reveal` on the contract, and returns the result.

**Response:**

```json
{
  "game_id": "42",
  "roll": 4,
  "player_guess": 4,
  "won": true,
  "payout": "50000000",
  "tx_hash": "abc123..."
}
```

#### `GET /api/bet/:game_id`

Fetch current state of a game.

**Response:**

```json
{
  "game_id": "42",
  "player": "G...",
  "bet_amount": "10000000",
  "player_guess": 4,
  "status": "resolved",
  "roll": 4,
  "won": true,
  "payout": "50000000",
  "created_at": "2025-01-01T12:00:00Z",
  "resolved_at": "2025-01-01T12:00:35Z"
}
```

#### `GET /api/history`

Returns the 50 most recently resolved games (anonymised — player addresses are truncated to first 8 chars).

#### `GET /api/stats`

Returns aggregate stats: total games, total volume, house profit/loss, win rate.

---

### Running locally

```bash
cd backend
npm install

# Run database migrations
npm run migrate

# Start in development mode (with auto-reload)
npm run dev

# Start in production mode
npm start
```

The server starts on `PORT` (default `3001`). A health check endpoint is available at `GET /health`.

---

## Frontend

A React SPA that handles wallet connection, bet construction, animated dice results, and game history.

### Wallet integration

The frontend integrates with Freighter via `@stellar/freighter-api`. On mainnet you can also support WalletConnect with `@stellar/wallet-sdk`.

The commit is generated entirely client-side before any network call:

```js
// lib/commit.js
import { sha256 } from "@noble/hashes/sha256";
import { randomBytes } from "@noble/hashes/utils";

export function generateCommit() {
  const secret = randomBytes(32);
  const commit = sha256(secret);
  return {
    secret: Buffer.from(secret).toString("hex"),
    commit: Buffer.from(commit).toString("hex"),
  };
}
```

The raw secret is stored in `sessionStorage` only until the reveal step is complete, then cleared.

### Running locally

```bash
cd frontend
npm install
npm run dev
```

The app runs on http://localhost:5173 by default.

Key environment variables in `.env`:

```env
VITE_API_URL=http://localhost:3001
VITE_CONTRACT_ID=C...
VITE_STELLAR_NETWORK=testnet
VITE_HORIZON_URL=https://horizon-testnet.stellar.org
```

---

## Game flow walkthrough

A step-by-step trace of a complete game from the player's perspective.

**1. Player opens the app and connects Freighter.**  
Freighter prompts the user to authorise the site. The frontend reads the player's public key.

**2. Player selects a guess (e.g. 4) and a bet amount (e.g. 1 XLM).**

**3. Frontend generates the player commitment.**

```js
const { secret, commit } = generateCommit();
sessionStorage.setItem("pending_secret", secret);
```

**4. Frontend builds and presents the `place_bet` transaction to Freighter.**  
The transaction invokes the contract's `place_bet` function with the player's address, bet amount, guess, and commit hash. Freighter signs it. The signed XDR is sent to `POST /api/bet`.

**5. Backend receives the signed XDR, submits it to Horizon.**  
The transaction executes on-chain. The contract locks the player's XLM in escrow and emits a `bet_placed` event.

**6. Backend event listener detects the new game.**  
Within seconds, the backend generates a `house_secret`, computes `house_commit = sha256(house_secret)`, stores the secret encrypted in the database, and submits `house_commit` to the contract.

**7. Frontend polls `GET /api/bet/:game_id` until status is `waiting_for_reveal`.**

**8. Frontend posts the player's secret to `POST /api/bet/:game_id/reveal`.**

```js
const secret = sessionStorage.getItem("pending_secret");
await api.post(`/bet/${gameId}/reveal`, { player_secret: secret });
sessionStorage.removeItem("pending_secret");
```

**9. Backend retrieves the house secret, calls `reveal` on the contract.**  
The contract verifies both commitments, computes the dice roll, and transfers the payout (or retains the bet). A `game_resolved` event is emitted.

**10. Frontend receives the result and animates the dice.**  
The player sees the roll and whether they won. The result is verifiable by anyone with the two raw secrets and the contract source code.

---

## Token configuration

By default the contract accepts native XLM. To use a custom asset (e.g. `CHIP`):

1. Issue the asset from your house account using Stellar's built-in asset issuance.
2. Wrap it as a Stellar Asset Contract (SAC) using the Stellar CLI:
   ```bash
   stellar contract asset deploy \
     --asset CHIP:$ISSUER_ADDRESS \
     --source $DEPLOYER_SECRET \
     --network testnet
   ```
3. Pass the resulting SAC contract address as `token` when calling `initialize`.
4. Set `TOKEN_CONTRACT_ID` in the backend `.env`.

Custom tokens give you more control over supply, enable promotional mechanics (bonus chips), and allow you to gate access by trustline.

---

## House bankroll management

The house bankroll must be sufficient to cover the maximum possible payout on any open game. For a 5× payout multiplier and a `MAX_BET` of 100 XLM, the house must always hold at least **500 XLM** in the contract.

Recommended approach:

- Maintain a cold wallet holding the bulk of the bankroll.
- Use `fund-house.sh` to top up the contract from the cold wallet when the on-chain balance drops below a threshold.
- Monitor balance via `GET /api/stats` and set alerts.
- Set `MAX_BET` in the contract to a value the house can always cover from its current balance. Consider making this dynamic based on contract balance.

> The contract does not currently enforce a `MAX_BET` — add this check in `place_bet` before mainnet deployment if required.

---

## Security model

### What the contract guarantees

- Neither party can determine the final dice result before both have committed.
- The house cannot selectively fail to reveal on losing games — expiry handling refunds the player.
- Player funds are never accessible to the house except through the resolve path.
- Contract logic is immutable once deployed (no upgrade mechanism by design — redeploy for changes).

### What you are responsible for

- **House secret key security.** If the `HOUSE_SECRET_KEY` is compromised, an attacker can drain the bankroll by calling `house_commit` with arbitrary secrets. Store it in a secrets manager (AWS Secrets Manager, HashiCorp Vault) — never in plaintext on disk.
- **House secret storage.** The backend stores house secrets encrypted at rest. The `SECRET_STORE_ENCRYPTION_KEY` must be rotated periodically and never committed to version control.
- **Frontend secret storage.** Player secrets live in `sessionStorage` only during the active game round. They are cleared immediately after reveal. Do not persist them longer than necessary.
- **Smart contract audit.** Do not deploy to mainnet without an independent security audit of `lib.rs`. The commit-reveal logic is particularly sensitive.
- **Regulatory compliance.** Online gambling is regulated or prohibited in many jurisdictions. You are responsible for geo-blocking, KYC, and any required licensing before operating this publicly.

### Known limitations

- The current implementation has no `MAX_BET` enforcement on-chain. Add this before mainnet deployment.
- The contract does not currently support multi-dice or side bets. These would require additional game type discriminants.
- The backend is a single point of failure for the house commit phase. Consider a redundant signer setup for production.

---

## Testing

### Contract tests

```bash
cd contract
cargo test
```

Tests cover: initialization, valid and invalid bets, commit-reveal happy path, mismatched reveal rejection, expiry handling, payout calculation.

### Backend tests

```bash
cd backend
npm test
```

Uses Jest + a local PostgreSQL test database. Integration tests mock the Stellar SDK and verify the full API flow including event handling.

### Frontend tests

```bash
cd frontend
npm test
```

Uses Vitest + React Testing Library. Tests cover the commit generation utility, wallet connection hook, and game state machine.

### End-to-end testnet test

```bash
./scripts/verify-game.sh <GAME_ID>
```

This script fetches both revealed secrets from the contract's event log, recomputes the XOR seed and dice result locally, and confirms it matches the on-chain resolution. Use it to spot-check game fairness.

---

## Deployment checklist

Before going to mainnet:

- [ ] Smart contract audited by an independent security firm
- [ ] `MAX_BET` enforced on-chain relative to contract balance
- [ ] House keypair stored in secrets manager, not `.env` file
- [ ] `SECRET_STORE_ENCRYPTION_KEY` rotated and secured
- [ ] Backend deployed with process manager (PM2 / systemd) and auto-restart
- [ ] Database backups configured
- [ ] Balance monitoring and low-bankroll alerts set up
- [ ] Geo-blocking implemented for restricted jurisdictions
- [ ] KYC / AML flow implemented if required by your jurisdiction
- [ ] Responsible gambling controls in place (deposit limits, self-exclusion)
- [ ] `CORS_ORIGIN` locked to production domain only
- [ ] All `.env.example` secrets replaced with production values
- [ ] Contract ID verified on Stellar Expert before frontend release
- [ ] End-to-end testnet run completed with `verify-game.sh`

---

## Contributing

Contributions are welcome. Please open an issue before submitting a pull request for significant changes.

### Development workflow

1. Fork the repository and create a feature branch from `main`.
2. Make your changes with tests covering new behaviour.
3. Run `make test` in the contract directory and `npm test` in `backend` and `frontend`.
4. Open a pull request with a clear description of what changed and why.

### Commit style

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(contract): add MAX_BET enforcement
fix(backend): handle house_commit retry on network timeout
docs: update deployment checklist
```

### Areas where help is welcome

- Additional game types (craps, roulette, hi-lo)
- WalletConnect support in the frontend
- Docker Compose setup for local development
- Formal verification of the commit-reveal scheme
- Multi-language frontend localisation

---

## License

MIT License — see [LICENSE](LICENSE) for full text.

---

_Built on Stellar · Powered by Soroban · Not financial or gambling advice · Use responsibly_
# LumenRoll

A provably fair, on-chain dice game built on Stellar using Soroban smart contracts. Players bet XLM (or any Stellar custom asset) on a dice roll outcome. Fairness is guaranteed through a commit-reveal randomness scheme — neither the player nor the house can manipulate the result after a bet is placed.

> **Status:** Active development · Testnet ready · Mainnet pending audit  
> **Network:** Stellar Testnet / Mainnet  
> **Stack:** Rust (Soroban) · Node.js · React · Stellar SDK

---

## Table of contents

- [How it works](#how-it-works)
- [Provably fair randomness](#provably-fair-randomness)
- [Repository structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Smart contract](#smart-contract)
  - [Contract API](#contract-api)
  - [Data types](#data-types)
  - [Error codes](#error-codes)
  - [Constants](#constants)
  - [Building and deploying](#building-and-deploying)
- [Backend API](#backend-api)
  - [Environment variables](#environment-variables)
  - [Endpoints](#endpoints)
  - [Running locally](#running-locally)
- [Frontend](#frontend)
  - [Wallet integration](#wallet-integration)
  - [Running locally](#running-locally-1)
- [Game flow walkthrough](#game-flow-walkthrough)
- [Token configuration](#token-configuration)
- [House bankroll management](#house-bankroll-management)
- [Security model](#security-model)
- [Testing](#testing)
- [Deployment checklist](#deployment-checklist)
- [Contributing](#contributing)
- [License](#license)

---

## How it works

