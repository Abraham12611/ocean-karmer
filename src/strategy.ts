export class MagnificentStrategy {
    private volatilityWindow: number[] = [];
    private readonly MAX_WINDOW_SIZE = 10;

    // Calculate dynamic range based on recent price volatility
    calculateRange(currentBinId: number): { min: number, max: number } {
        this.updateVolatility(currentBinId);
        
        const volatility = this.getVolatility();
        
        // Base range is small (concentrated)
        let range = 10; 

        // If high volatility, widen the range to avoid IL and frequent rebalancing
        if (volatility > 5) {
            range = 40; // Wider range for turbulent waters
            console.log(`🌊 High Volatility detected (${volatility.toFixed(2)}). Widening range to +/- ${range} bins.`);
        } else {
            console.log(`calm seas (${volatility.toFixed(2)}). Keeping tight formation +/- ${range} bins.`);
        }

        return {
            min: currentBinId - range,
            max: currentBinId + range
        };
    }

    private updateVolatility(binId: number) {
        this.volatilityWindow.push(binId);
        if (this.volatilityWindow.length > this.MAX_WINDOW_SIZE) {
            this.volatilityWindow.shift();
        }
    }

    private getVolatility(): number {
        if (this.volatilityWindow.length < 2) return 0;
        
        // Simple standard deviation of bin IDs
        const mean = this.volatilityWindow.reduce((a, b) => a + b, 0) / this.volatilityWindow.length;
        const variance = this.volatilityWindow.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / this.volatilityWindow.length;
        return Math.sqrt(variance);
    }

    shouldRebalance(currentBinId: number, position: { min: number, max: number }): boolean {
        // Rebalance if price is nearing the edge of the range (buffer of 10%)
        const range = position.max - position.min;
        const buffer = Math.floor(range * 0.1); 

        const distToMin = currentBinId - position.min;
        const distToMax = position.max - currentBinId;

        if (distToMin < buffer || distToMax < buffer) {
            console.log(`⚠️ Price approaching range edge. Rebalance imminent.`);
            return true;
        }
        
        return false;
    }
}
