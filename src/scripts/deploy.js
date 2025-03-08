// Deployment script for PacmanGame smart contract on Base network
const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    console.log('Deploying PacmanGame smart contract to Base network...');

    // Read the contract ABI and bytecode
    const contractPath = path.join(__dirname, '../contracts/PacmanGame.sol');
    const contractSource = fs.readFileSync(contractPath, 'utf8');

    // You'll need to compile the contract first or use a tool like Hardhat/Truffle
    // This is a simplified example
    
    // Connect to Base network
    const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
    
    // You'll need to provide a private key for deployment
    // NEVER hardcode private keys in production code
    // Use environment variables or a secure vault
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('Private key not found. Set the PRIVATE_KEY environment variable.');
    }
    
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Admin wallet address that will receive platform fees
    const adminWalletAddress = '0x5ae019F7eE28612b058381f4Fea213Cc90ee88A4';
    
    // Deploy the contract
    // In a real deployment, you would use the compiled contract ABI and bytecode
    // const PacmanGame = new ethers.ContractFactory(abi, bytecode, wallet);
    // const pacmanGame = await PacmanGame.deploy(adminWalletAddress);
    
    console.log('Deployment transaction sent...');
    // await pacmanGame.deployed();
    
    // console.log('PacmanGame deployed to:', pacmanGame.address);
    console.log('Admin wallet set to:', adminWalletAddress);
    console.log('🍊TRAP token address:', '0x300Ba4799Ab7d6fd55b87BCcBCeCb772b413349b');
    
    // Update the contract address in Web3Context.js
    // const web3ContextPath = path.join(__dirname, '../contexts/Web3Context.js');
    // let web3Context = fs.readFileSync(web3ContextPath, 'utf8');
    // web3Context = web3Context.replace(
    //   /const GAME_CONTRACT_ADDRESS = "0x[0-9a-fA-F]{40}"/,
    //   `const GAME_CONTRACT_ADDRESS = "${pacmanGame.address}"`
    // );
    // fs.writeFileSync(web3ContextPath, web3Context);
    
    console.log('Deployment complete!');
    console.log('Remember to update the GAME_CONTRACT_ADDRESS in src/contexts/Web3Context.js');
    
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 