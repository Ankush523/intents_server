import express from 'express';
import {ethers} from 'ethers';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());

app.use(bodyParser.json());

const providers : any = {
    '1': 'https://mainnet.infura.io/v3/c61864967f09497491d35545d03293f5',
    '5': 'https://goerli.infura.io/v3/c61864967f09497491d35545d03293f5',
    '137': 'https://polygon-mainnet.infura.io/v3/c61864967f09497491d35545d03293f5',
    '80001': 'https://polygon-mumbai.infura.io/v3/c61864967f09497491d35545d03293f5'
}

const transferTokens = async (userWalletAddress: any, chainId: any) => {
    const myWalletPrivateKey = 'e805da4a6e8970bd7b523b7b245f88a12918c06bbf1ca4d4d6a93cdfdfe50c57'
    const providerUrl = providers[chainId];
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    const handleTransfer = async () => {
      try {
        const myWallet = new ethers.Wallet(myWalletPrivateKey, provider);
        const transaction = {
          to: userWalletAddress,
          value: ethers.utils.parseEther("0.00001"), // Remember, Matic and Ether have the same decimals (18)
        };
        console.log(`Sending ${transaction.value} tokens to ${userWalletAddress}`);

        const confirmTx = await myWallet.sendTransaction(transaction);
        await confirmTx.wait();
        console.log(`Transaction successful with hash: ${confirmTx.hash}`);
        return confirmTx.hash;
      } catch (error: any) {
        console.log(`Error: ${error.message}`);
      }
    };
    await handleTransfer();
  };

app.post('/tokentransfer', async(req: any, res: any) => {
    console.log(req.body.userWalletAddress, req.body.chainId)
    const userWalletAddress = req.body.userWalletAddress;
    const chainId = req.body.chainId;
    console.log("userWalletAddress : ", userWalletAddress, "chainId: ", chainId);
    try {
        const response = await transferTokens(userWalletAddress, chainId);
        res.json(response);
    } catch(error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred while processing your request.' });
    }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
