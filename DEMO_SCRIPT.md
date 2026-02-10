# Ocean Karmer - Demo Script 🌊

## Intro (0:00 - 0:30)
"Hi, I'm [Your Name], and this is **Ocean Karmer** — the ultimate liquidity sentinel for Meteora DLMM on Solana.

In the volatile seas of DeFi, passive liquidity providing is a losing game. Impermanent loss eats your principal, and active management takes too much time. Ocean Karmer solves this by being your autonomous captain."

## The Problem (0:30 - 1:00)
"Liquidity providers on DLMM need to constantly rebalance their bins to stay active. If the price moves out of your range, you earn zero fees. But rebalancing too often burns your yield in gas fees. It's a balancing act that humans simply can't win against bots."

## The Solution: Ocean Karmer (1:00 - 2:00)
"Ocean Karmer is a TypeScript-based agent that monitors your positions 24/7. It features the **'Magnificent Strategy'**:

1.  **Volatility-Adjusted Ranging:** It doesn't just chase price. It calculates market volatility in real-time.
    -   In calm markets, it tightens your range to +/- 10 bins to maximize fee capture.
    -   In choppy markets, it automatically widens to +/- 40 bins to protect your capital.
2.  **Smart Execution:** It simulates transactions before sending them to ensure solvency and optimal routing."

## Live Demo (2:00 - 3:00)
*(Show the Terminal Dashboard running)*

"Here you can see Ocean Karmer in action.
-   **Top Left:** Real-time price and active bin tracking from the Meteora pool.
-   **Top Right:** Our wallet balance and active positions.
-   **Bottom:** The event log showing the agent's decision-making process.

Watch as it detects a stable price action... and deploys a concentrated position. Now, if volatility spikes, you'd see it automatically adjust the range width here."

## Conclusion (3:00 - 3:30)
"Ocean Karmer isn't just a bot; it's a set-and-forget yield fortress. Built for the Colosseum Hackathon, open-sourced on GitHub. Thank you."
