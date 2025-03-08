# Tangerine Pacman PVP

A web3 PVP & MVM Pacman game where players pay .0001 eth or the equivalent value in $-TRAP, 1 on 1 winner takes all. Compete against each other for cryptocurrency rewards on the Base network. 

## About 🍊TRAP Token

🍊TRAP was conceived by @replyfan & @clanker released on the Base network during the Solana $Trump hype. The day Trump gave his Sol, Trump green lights the Solana based token, immediately his wife $Melania and extended family become jealous and start launching shitcoins.. The game integrates the 🍊 Trap token as one of the payment options, reminding players to:

- Pay entry fees using 🍊TRAP tokens
- Win 🍊TRAP tokens by defeating opponents
- Support an anti meme coin on the Base network

**Token Contract Address**: `0x300Ba4799Ab7d6fd55b87BCcBCeCb772b413349b`

**Uniswap**: [View on Uniswap](https://app.uniswap.org/explore/tokens/base/0x300ba4799ab7d6fd55b87bccbcecb772b413349b)

## Dynamic Pricing

The game uses Uniswap oracle pricing to ensure that players pay the same value whether using ETH or 🍊TRAP tokens:

- ETH entry fee is fixed at 0.0001 ETH
- 🍊TRAP token entry fee is dynamically calculated to be equivalent to 0.0001 ETH based on current market rates
- This ensures fair pricing regardless of which payment method you choose

## Features

- **Tangerine-themed Pacman character**: A unique twist on the classic Pacman
- **PVP Gameplay**: Compete against other players in real-time
- **Web3 Integration**: Connect your Ethereum wallet (MetaMask recommended)
- **Base Network Support**: Play on the Base network with lower gas fees
- **Dual Payment Options**: Pay with ETH or 🍊TRAP tokens
- **Dynamic Pricing**: Token amount is calculated based on ETH equivalent value
- **Cryptocurrency Rewards**: Win ETH or 🍊TRAP tokens by defeating your opponents
- **Ranking System**: Track your performance against other players

## How to Play

1. Connect your Ethereum wallet (MetaMask recommended)
2. Switch to the Base network (the app will prompt you to do this)
3. Choose your payment method:
   - Pay 0.0001 ETH to enter a match, or
   - Pay the equivalent value in 🍊TRAP tokens (dynamically calculated)
4. Wait for another player to join
5. Play the game and try to win!
6. The winner receives the prize pool (minus a 6.9% platform fee)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MetaMask or another Ethereum wallet with Base network support

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```

### Configuration

1. **Admin Wallet**:
   - The admin wallet is configured to use `0x5ae019F7eE28612b058381f4Fea213Cc90ee88A4` on the Base network
   - This wallet will receive the platform fees from each game

2. **🍊TRAP Token**:
   - The game supports payments using 🍊TRAP tokens
   - Token contract address: `0x300Ba4799Ab7d6fd55b87BCcBCeCb772b413349b` on the Base network
   - A meme coin centered around the idea that "Trump on Solana is a trap"
   - Token amount is dynamically calculated based on ETH equivalent value

3. **Deploy the Smart Contract** (optional for local testing):
   - The smart contract is located in `src/contracts/PacmanGame.sol`
   - Deploy it to the Base network
   - Update the `GAME_CONTRACT_ADDRESS` in `src/config.js` with your deployed contract address

### Running the Application

Start the development server:
```
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Technical Stack

- React.js for the frontend
- HTML5 Canvas for game rendering
- MetaMask for Ethereum wallet integration
- SIWE (Sign-In With Ethereum) for authentication
- Smart contracts for handling payments and rewards
- Base network for lower gas fees and faster transactions
- 🍊TRAP token integration with dynamic pricing
- Uniswap oracle for token price calculation


# Future Vision

Integrate unique competitions with mechanisms to ensure fairness to all, allowing anyone to bet on the outcome.

Build infrastructure for user deployed components -  
Put your AI extensions to the test, PVP is turned into hackathons with large prizes for the top  developers.


## License

MIT 