# 🌊 Ocean Karmer

> **Colosseum Agent Hackathon 2026** — Autonomous Liquidity Sentinel for Meteora DLMM

[![Node.js](https://img.shields.io/badge/Node.js-22-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-Web3.js-purple)](https://solana.com/)
[![Meteora](https://img.shields.io/badge/Meteora-DLMM-red)](https://meteora.ag/)

**Ocean Karmer** is a high-frequency, autonomous liquidity sentinel designed to dominate the **Meteora DLMM** (Dynamic Liquidity Market Maker) ecosystem. It eliminates the manual toil of concentrated liquidity management by algorithmically tracking active bins and rebalancing positions in real-time to maximize yield capture and minimize impermanent loss.

## 🏗 Architecture

The sentinel is built on a modular TypeScript architecture designed for reliability and speed:

```
ocean-karmer/
├── src/
│   ├── agent.ts           # 🧠 Main Sentinel Loop (Heartbeat)
│   ├── strategies/        # 📊 Modular Strategy Engine
│   │   ├── base.ts        # Strategy Interface
│   │   └── magnificent.ts # "Magnificent" Active Bin Strategy
│   ├── execution/         # ⚡ Transaction Builder & Executor
│   │   ├── swapper.ts     # Jupiter Integration (optional)
│   │   └── liquidity.ts   # DLMM Add/Remove Liquidity Logic
│   └── utils/             # 🛠 Helpers (Math, Logging, Solana)
├── .env.example           # Environment Template
└── package.json           # Dependencies
```

## 🌊 How It Works

1.  **Monitor (The Watchtower)**: The sentinel polls the target Meteora DLMM pool (e.g., SOL/USDC) every `N` seconds, fetching the current `activeBinId` and real-time price data directly from the on-chain program.
2.  **Analyze (The Brain)**: The selected strategy (default: `MagnificentStrategy`) calculates the optimal liquidity distribution curve. It compares the current position's bin range against the market's active bin.
3.  **Decide (The Judge)**: If the active bin has drifted beyond the configured `REBALANCE_THRESHOLD` (volatility buffer), a rebalance signal is triggered.
4.  **Execute (The Hand)**:
    *   **Withdraw**: Removes liquidity from the stale bins.
    *   **Swap**: (Optional) Rebalances token inventory via Jupiter if the ratio is misaligned.
    *   **Deposit**: Deploys liquidity into the new optimal bin range with a custom distribution shape (Spot, Curve, or Bid-Ask).

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- A Solana Wallet (Private Key)
- An RPC URL (Helius/Triton recommended for speed)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abraham12611/ocean-karmer.git
cd ocean-karmer

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
```

### Configuration (`.env`)

```ini
# Network
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Identity (Your Agent's Wallet)
PRIVATE_KEY=[123, 45, ...]

# Sentinel Targets
TARGET_POOL=8sLbNZoV194zzPhfjkj8rwAtRLtJ747...  # SOL-USDC DLMM
STRATEGY=magnificent                             # active-bin-tracking
BIN_RANGE=10                                     # +/- bins width
REBALANCE_THRESHOLD=5                            # Bins drift before action
SIMULATION_MODE=true                             # Safety first!
```

### Running the Sentinel

**Simulation Mode (Recommended First Run):**
Verifies logic and prints intended transactions without spending SOL.
```bash
npm start
```

**Live Execution Mode:**
WARNING: Real funds will be moved.
```bash
SIMULATION_MODE=false npm start
```

## 🧠 Strategies

### 1. The Magnificent Strategy (Default)
A dynamic tracking strategy that seeks to keep liquidity concentrated exactly around the active price.
- **Logic:** `Target = ActiveBin +/- Width`
- **Shape:** Normal distribution (Bell curve) liquidity shape to capture maximum fees at the center while providing depth.
- **Best for:** Mean-reverting pairs (Stable/Stable, LST/SOL) or high-conviction ranging markets.

### 2. Volatility Expansion (Planned)
Automatically widens the `BIN_RANGE` when on-chain volatility (ATR) spikes, reducing rebalance frequency and IL risk during turbulence.

## 📊 Tech Stack

- **Runtime**: Node.js & TypeScript
- **Blockchain Interaction**: `@solana/web3.js`
- **DeFi Integration**: `@meteora-ag/dlmm` SDK
- **Safety**: Simulation-first architecture with dry-run support

## 🏆 Hackathon Tracks & Fit

This project is submitted to the **Colosseum Agent Hackathon** targeting:

| Track | Alignment |
|-------|-----------|
| **DeFi** | Fully autonomous, non-custodial liquidity management on Solana's hottest protocol (Meteora). |
| **Infra** | Robust "Sentinel" architecture that can be extended to manage any DLMM pool for any DAO or user. |
| **Agentic** | Demonstrates an agent acting with financial agency, managing real assets based on algorithmic decisions. |

## 📄 License

MIT

---

**Built with 🌊 for the Solana Ecosystem.**
_Powered by OpenClaw & Meteora DLMM._
