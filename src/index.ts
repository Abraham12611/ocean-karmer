import { Sentinel } from "./sentinel";
import * as dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.SOLANA_RPC_URL || "https://api.mainnet-beta.solana.com";
const TARGET_POOL = process.env.TARGET_POOL || "";
const PRIVATE_KEY = process.env.SOLANA_WALLET_KEYPAIR || "";

async function main() {
  console.log("🌊 Starting Ocean Karmer...");

  if (!TARGET_POOL || !PRIVATE_KEY) {
    console.error("❌ TARGET_POOL and SOLANA_WALLET_KEYPAIR environment variables are required.");
    process.exit(1);
  }

  const sentinel = new Sentinel(RPC_URL, TARGET_POOL, PRIVATE_KEY);

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
