# Ocean Karmer 🌊

A Meteora DLMM Liquidity Sentinel for the Colosseum Agent Hackathon.

## Overview

Ocean Karmer is an autonomous sentinel designed to monitor and manage liquidity positions on Meteora DLMM (Dynamic Liquidity Market Maker) pools on Solana. Unlike traditional AMMs, DLMM allows for concentrated liquidity within specific price bins. While this maximizes capital efficiency, it requires constant monitoring to ensure positions remain in range. Manual management is tedious and inefficient.

Ocean Karmer solves this by running a continuous loop that checks the active bin ID against your position's range. When the price moves out of range, the sentinel automatically rebalances your liquidity into the new active bins, capturing fees and minimizing impermanent loss.

## Features

- **Autonomous Monitoring**: Continuous loop checking pool status every few seconds.
- **Magnificent Strategy**: Algorithmic range calculation based on the current active bin ID.
- **Simulation Mode**: Test strategies without risking real capital (dry-run mode).
- **Risk Management**: Basic stop-loss and take-profit logic (wip).
- **Multi-Pool Support**: Configurable target pools via environment variables.

## Tech Stack

- **Framework**: Node.js / TypeScript
- **SDK**: `@meteora-ag/dlmm`
- **Blockchain**: Solana
- **Libraries**: `@solana/web3.js`, `bn.js`

## Strategy Logic

The core strategy (`MagnificentStrategy`) operates on the principle of active bin tracking:
1. **Fetch Active Bin**: Query the DLMM pool for the current active bin ID.
2. **Calculate Range**: Determine the optimal bin range (e.g., +/- 10 bins) around the active bin.
3. **Compare**: Check if the current position is within the optimal range.
4. **Rebalance**: If out of range, withdraw liquidity and re-deposit into the new optimal bins.

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Abraham12611/ocean-karmer.git
   cd ocean-karmer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and set the following:
   ```env
   SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   TARGET_POOL=<DLMM_POOL_ADDRESS>
   PRIVATE_KEY=<YOUR_WALLET_PRIVATE_KEY_ARRAY>
   ```

4. Run the sentinel:
   ```bash
   npm start
   ```

## Simulation Mode

To run in simulation mode (no transactions sent):
```bash
SIMULATION_MODE=true npm start
```
This will log the intended actions without executing them on-chain.

## Roadmap

- [x] Autonomous Monitoring
- [x] Basic Rebalancing Strategy
- [ ] Multi-Strategy Support (Volatility, Stable)
- [ ] Risk Management (Stop Loss)
- [ ] Analytics Dashboard

## License

MIT
