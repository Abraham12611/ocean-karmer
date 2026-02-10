import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import DLMM, { StrategyType } from "@meteora-ag/dlmm";
import bs58 from "bs58";
import BN from "bn.js";
import { MagnificentStrategy } from "./strategy";

export class Sentinel {
  private connection: Connection;
  private poolAddress: PublicKey;
  private dlmm: DLMM | null = null;
  private wallet: Keypair;
  private strategy: MagnificentStrategy;

  constructor(rpcUrl: string, poolAddressStr: string, privateKey: string) {
    this.connection = new Connection(rpcUrl, "confirmed");
    this.poolAddress = new PublicKey(poolAddressStr);
    this.wallet = Keypair.fromSecretKey(bs58.decode(privateKey));
    this.strategy = new MagnificentStrategy();
  }

  async initialize() {
    console.log(`🌊 Initializing Sentinel for pool: ${this.poolAddress.toBase58()}`);
    this.dlmm = await DLMM.create(this.connection, this.poolAddress);
    console.log("✅ DLMM Instance created.");
  }

  async monitor() {
    if (!this.dlmm) {
      throw new Error("DLMM not initialized. Call initialize() first.");
    }

    console.log("🔍 Starting monitoring loop...");
    
    // Refresh state
    await this.dlmm.refetchStates();
    
    const activeBin = await this.dlmm.getActiveBin();
    
    console.log(`
    ------------------------------------------------
    📊 Pool Status Update
    ------------------------------------------------
    Active Bin ID: ${activeBin.binId}
    Price: ${activeBin.price}
    Base Token: ${this.dlmm.tokenX.publicKey.toBase58()}
    Quote Token: ${this.dlmm.tokenY.publicKey.toBase58()}
    ------------------------------------------------
    `);
    
    // Check user positions
    const positions = await this.dlmm.getPositionsByUserAndLbPair(this.wallet.publicKey);
    console.log(`found ${positions.userPositions.length} positions`);

    if (positions.userPositions.length === 0) {
        console.log("⚠️ No active positions found. Considering entry...");
        
        // Use Magnificent Strategy to calculate initial range
        const range = this.strategy.calculateRange(activeBin.binId);
        const relativeRange = Math.floor((range.max - range.min) / 2);
        
        await this.openPosition(activeBin.binId, relativeRange);
    } else {
        // Monitor existing positions for rebalancing
        for (const position of positions.userPositions) {
            console.log(`Checking position ${position.publicKey.toBase58()}...`);
        }
    }

    return {
        activeBinId: activeBin.binId,
        price: activeBin.price
    };
  }

  async openPosition(centerBinId: number, range: number) {
      if (!this.dlmm) return;

      const minBinId = centerBinId - range;
      const maxBinId = centerBinId + range;

      console.log(`🚀 [SIMULATION] Opening position: [${minBinId}, ${maxBinId}]`);
      console.log(`   - Range Width: ${range * 2} bins`);
      console.log(`   - Strategy: SpotBalanced (50/50)`);

      try {
          // Simulation delay
          await new Promise(r => setTimeout(r, 1000));
          console.log("📝 [SIMULATION] Transaction signed and sent...");
          await new Promise(r => setTimeout(r, 2000));
          console.log("✅ [SIMULATION] Transaction Confirmed! Signature: 5xSimulatedSignature...");
          
      } catch (err) {
          console.error("❌ Failed to open position:", err);
      }
  }
}
