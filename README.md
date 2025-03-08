# Tangerine Pacman PVP

A web3-enabled PVP Pacman game where players can compete against each other for cryptocurrency rewards on the Base network.

## Features

- **Tangerine-themed Pacman character**: A unique twist on the classic Pacman
- **PVP Gameplay**: Compete against other players in real-time
- **Web3 Integration**: Connect your Ethereum wallet (MetaMask recommended)
- **Base Network Support**: Play on the Base network with lower gas fees
- **Dual Payment Options**: Pay with ETH or 🍊TRAP tokens
- **Cryptocurrency Rewards**: Win ETH or 🍊TRAP tokens by defeating your opponents
- **Ranking System**: Track your performance against other players

## How to Play

1. Connect your Ethereum wallet (MetaMask recommended)
2. Switch to the Base network (the app will prompt you to do this)
3. Choose your payment method:
   - Pay 0.0001 ETH to enter a match, or
   - Pay 10 🍊TRAP tokens to enter a match
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
- 🍊TRAP token integration for alternative payment method

## License

MIT 