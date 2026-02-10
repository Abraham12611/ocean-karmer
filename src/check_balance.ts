import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.SOLANA_WALLET_KEYPAIR || "";

async function checkBalance() {
    if (!PRIVATE_KEY) {
        console.log("No private key found");
        return;
    }
    const wallet = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    console.log(`Wallet Address: ${wallet.publicKey.toBase58()}`);
    
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`Devnet Balance: ${balance / 1e9} SOL`);
}

checkBalance();
