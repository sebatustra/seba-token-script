import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";

export class TokenCoordinator {
    readonly connection: web3.Connection;
    readonly payer: web3.Keypair;

    constructor(connection: web3.Connection, payer: web3.Keypair) {
        this.connection = connection;
        this.payer = payer;
    }

    async createNewMint(
        mintAuthority: web3.PublicKey,
        freezeAuthority: web3.PublicKey,
        decimals: number
    ): Promise<web3.PublicKey> {
        const tokenMint = await token.createMint(
            this.connection,
            this.payer,
            mintAuthority,
            freezeAuthority,
            decimals
        );
    
        console.log(
            `Token Mint: https://explorer.solana.com/address/${tokenMint}?cluster=devnet`
        );
    
        return tokenMint;
    }

    async createTokenAccount(
        mint: web3.PublicKey,
        owner: web3.PublicKey
    ): Promise<token.Account> {
        const tokenAccount = await token.getOrCreateAssociatedTokenAccount(
            this.connection,
            this.payer,
            mint,
            owner
        );
    
        console.log(
            `Token Account: https://explorer.solana.com/address/${tokenAccount.address}?cluster=devnet`
        );
    
        return tokenAccount
    }

    async mintTokens(
        mint: web3.PublicKey,
        destination: web3.PublicKey,
        authority: web3.Keypair,
        amount: number
    ): Promise<void> {
        const transactionSignature = await token.mintTo(
            this.connection,
            this.payer,
            mint,
            destination,
            authority,
            amount
        );
    
        console.log(
            `Mint Token Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
        );
    }

    async approveDelegate(
        account: web3.PublicKey,
        delegate: web3.PublicKey,
        owner: web3.Signer | web3.PublicKey,
        amount: number
    ): Promise<void> {
        const transactionSignature = await token.approve(
            this.connection,
            this.payer,
            account,
            delegate,
            owner,
            amount
        );
    
        console.log(
            `Approve Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
        );
    }

    async transferTokens(
        source: web3.PublicKey,
        destination: web3.PublicKey,
        owner: web3.Keypair,
        amount: number
    ): Promise<void> {
        const transactionSignature = await token.transfer(
            this.connection,
            this.payer,
            source,
            destination,
            owner,
            amount
        );
    
        console.log(
            `Transfer Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
        );
    }

    async revokeDelegate(
        account: web3.PublicKey,
        owner: web3.Signer | web3.PublicKey
    ): Promise<void> {
        const transactionSignature = await token.revoke(
            this.connection,
            this.payer,
            account,
            owner
        );

        console.log(
            `Revote Delegate Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
        );
    }

    async burnTokens(
        account: web3.PublicKey,
        mint: web3.PublicKey,
        owner: web3.Keypair,
        amount: number
    ): Promise<void> {
        const transactionSignature = await token.burn(
            this.connection,
            this.payer,
            account,
            mint,
            owner,
            amount
        );

        console.log(
            `Burn Transaction: https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`
        );
    }
}