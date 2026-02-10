import blessed from "blessed";
import contrib from "blessed-contrib";
import { Sentinel } from "./sentinel";
import * as dotenv from "dotenv";

dotenv.config();

// Configuration
const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const TARGET_POOL = process.env.TARGET_POOL || "";
const PRIVATE_KEY = process.env.SOLANA_WALLET_KEYPAIR || "";

if (!TARGET_POOL || !PRIVATE_KEY) {
    console.error("❌ ENV variables missing. Please check .env");
    process.exit(1);
}

// UI Setup
const screen = blessed.screen({
    smartCSR: true,
    title: "Ocean Karmer - Sentinel Dashboard"
});

const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

// Components
const priceLine = grid.set(0, 0, 6, 8, contrib.line, {
    style: { line: "yellow", text: "green", baseline: "black" },
    xLabelPadding: 3,
    xPadding: 5,
    showLegend: true,
    legend: { width: 12 },
    label: 'Pool Price History'
});

const statusBox = grid.set(0, 8, 6, 4, blessed.box, {
    label: 'Sentinel Status',
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'cyan' } }
});

const logBox = grid.set(6, 0, 6, 12, contrib.log, {
    fg: "green",
    selectedFg: "green",
    label: 'Activity Log'
});

// State
const priceData = {
    x: [] as string[],
    y: [] as number[],
    title: 'Price'
};

const sentinel = new Sentinel(RPC_URL, TARGET_POOL, PRIVATE_KEY);

// Override console.log to feed the log box
const originalLog = console.log;
console.log = function(...args) {
    logBox.log(args.join(" "));
    // screen.render(); // Avoid too many renders?
};
console.error = function(...args) {
    logBox.log(`{red-fg}${args.join(" ")}{/red-fg}`);
};

// Start
screen.render();

async function run() {
    logBox.log("{cyan-fg}🌊 Ocean Karmer UI Initialized{/cyan-fg}");
    logBox.log(`Target Pool: ${TARGET_POOL}`);
    
    try {
        await sentinel.initialize();
        
        let tick = 0;
        setInterval(async () => {
            try {
                // Monitor returns data
                // We need to modify Sentinel to return data or expose it
                // For now, we rely on the side effects (logs) and maybe hack the class to return data
                const data = await sentinel.monitor();
                
                // Update Charts
                const timeLabel = new Date().toLocaleTimeString();
                priceData.x.push(timeLabel);
                priceData.y.push(Number(data.price));
                
                if (priceData.x.length > 20) {
                    priceData.x.shift();
                    priceData.y.shift();
                }

                priceLine.setData([priceData]);

                // Update Status Box
                const volatility = "Low (Calculated)"; // Placeholder, we should expose strategy volatility
                const content = `
{bold}Active Bin:{/bold} ${data.activeBinId}
{bold}Price:{/bold}      ${Number(data.price).toFixed(6)}
{bold}Volatility:{/bold} ${volatility}
{bold}Positions:{/bold}  0 (Simulated)
{bold}Strategy:{/bold}   Magnificent
                `;
                statusBox.setContent(content);

                screen.render();
                tick++;
            } catch (err: any) {
                logBox.log(`Error: ${err.message}`);
            }
        }, 5000); // 5s refresh

    } catch (e: any) {
        logBox.log(`Fatal: ${e.message}`);
    }
}

// Quit on Escape, q, or C-c.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
});

run();
