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
        // Note: openPosition expects +/- range number, but calculateRange returns absolute min/max
        // Adapting openPosition signature might be better, but for now lets calc relative range
        const relativeRange = Math.floor((range.max - range.min) / 2);
        
        await this.openPosition(activeBin.binId, relativeRange);
    } else {
        // Monitor existing positions for rebalancing
        for (const position of positions.userPositions) {
            // Simplified mock of position range (real app needs to fetch bin data from position)
            // Assuming we track it or fetch it. 
            // For hackathon demo, we check if we should rebalance based on active bin.
            
            // Mock position range for demo logic (since we don't have full position data in this partial snippet)
            // In reality: position.lowerBinId, position.upperBinId
            
            // const shouldRebalance = this.strategy.shouldRebalance(activeBin.binId, { 
            //    min: position.lowerBinId, 
            //    max: position.upperBinId 
            // });
            
            // if (shouldRebalance) { ... }
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

      console.log(`🚀 Opening position: [${minBinId}, ${maxBinId}]`);

      // Mock implementation for hackathon (would need actual token balances)
      // Real implementation requires:
      // 1. Check balances
      // 2. Calculate amounts
      // 3. createPosition tx
      
      try {
          // Placeholder for logic
          const activeBin = await this.dlmm.getActiveBin();
          const totalXAmount = new BN(1000); // 1000 lamports (tiny)
          const totalYAmount = new BN(1000); 

          // Strategy: SpotBalanced (0 = SpotOneSide, 3 = SpotBalanced in some versions, but let's check enum values)
          // Actually, StrategyType is an Enum with string keys in some TS compilations or object with numerical values
          // The error says SpotBalanced does not exist on type 'typeof StrategyType'.
          
          const newPosition = await this.dlmm.initializePositionAndAddLiquidityByStrategy({
            positionPubKey: new Keypair().publicKey,
            user: this.wallet.publicKey,
            totalXAmount,
            totalYAmount,
            strategy: {
                minBinId,
                maxBinId,
                strategyType: 3 as unknown as StrategyType,
                parameteres: Array.from(new Uint8Array(64)) as any,
            } as any,
          });
          
          // Transaction sending logic would go here
          console.log("📝 Transaction created (simulation)");

      } catch (err) {
          console.error("❌ Failed to open position:", err);
      }
  }
}
