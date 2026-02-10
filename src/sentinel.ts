import { Connection, PublicKey } from "@solana/web3.js";
import DLMM from "@meteora-ag/dlmm";

export class Sentinel {
  private connection: Connection;
  private poolAddress: PublicKey;
  private dlmm: DLMM | null = null;

  constructor(rpcUrl: string, poolAddressStr: string) {
    this.connection = new Connection(rpcUrl, "confirmed");
    this.poolAddress = new PublicKey(poolAddressStr);
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
    const activeBinPrice = this.dlmm.fromPrice(activeBin.price);
    
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
    
    // In a real loop, we would set an interval.
    // For now, we return the data.
    return {
        activeBinId: activeBin.binId,
        price: activeBin.price
    };
  }
}
