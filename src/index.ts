import { Connection } from "@solana/web3.js";
import { Sentinel } from "./sentinel";
import * as dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const TARGET_POOL = process.env.TARGET_POOL || "";

async function main() {
  console.log("🌊 Starting Ocean Karmer...");

  if (!TARGET_POOL) {
    console.error("❌ TARGET_POOL environment variable is required.");
    process.exit(1);
  }

  const sentinel = new Sentinel(RPC_URL, TARGET_POOL);

  try {
    await sentinel.initialize();
    
    // Simulate a monitoring cycle
    setInterval(async () => {
      try {
        await sentinel.monitor();
      } catch (err) {
        console.error("⚠️ Error in monitoring loop:", err);
      }
    }, 10000); // Check every 10 seconds

  } catch (error) {
    console.error("❌ Fatal Error:", error);
    process.exit(1);
  }
}

main();
