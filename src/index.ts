import { initializeKeypair } from "./initializeKeypair";
import * as web3 from "@solana/web3.js";
import * as token from "@solana/spl-token";
import { TokenCoordinator } from "./tokenCoordinator";
import dotenv from "dotenv";
dotenv.config();

async function main() {
    const connection = new web3.Connection(process.env.HELIUS_URL || web3.clusterApiUrl("devnet"), {commitment: "confirmed"});
    const user = await initializeKeypair(connection);

    const tokenCoordinator = new TokenCoordinator(connection, user);

    const mint = await tokenCoordinator.createNewMint(
        user.publicKey, 
        user.publicKey, 
        2
    );

    const mintInfo = await token.getMint(connection, mint);

    const tokenAccount = await tokenCoordinator.createTokenAccount(
        mint,
        user.publicKey
    );

    await tokenCoordinator.mintTokens(
        mint,
        tokenAccount.address,
        user,
        100 * 10 ** mintInfo.decimals
    );

    const delegate = web3.Keypair.generate();
    const receiver = new web3.PublicKey("DLN6aG6ZS6wtfBnSZhonSGeNSfbunT2Ee5vN2Fc2Yxeq");

    const receiverTokenAddress = await tokenCoordinator.createTokenAccount(
        mint,
        receiver
    );

    await tokenCoordinator.approveDelegate(
        tokenAccount.address,
        delegate.publicKey,
        user.publicKey,
        50 * 10 ** mintInfo.decimals
    );

    await tokenCoordinator.transferTokens(
        tokenAccount.address,
        receiverTokenAddress.address,
        delegate,
        50 * 10 ** mintInfo.decimals
    );

    await tokenCoordinator.revokeDelegate(
        tokenAccount.address,
        user.publicKey
    )

    await tokenCoordinator.burnTokens(
        tokenAccount.address,
        mint,
        user,
        25 * 10 ** mintInfo.decimals
    )
}

main()
    .then(() => {
        console.log("Finished successfully");
        process.exit(0);
    })
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })
