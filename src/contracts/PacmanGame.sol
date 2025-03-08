// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title PacmanGame
 * @dev Contract for handling Pacman PVP game payments and rewards on the Base network
 * @notice This contract is designed to be deployed on the Base network
 * @notice Admin wallet is set to 0x5ae019F7eE28612b058381f4Fea213Cc90ee88A4
 * @notice Supports both ETH and 🍊TRAP token (0x300Ba4799Ab7d6fd55b87BCcBCeCb772b413349b) payments
 */
contract PacmanGame {
    // Game fee constants
    uint256 public constant ENTRY_FEE = 0.0001 ether;
    // Token entry fee is now dynamic and passed as a parameter
    uint256 public constant PLATFORM_FEE_PERCENTAGE = 69; // 6.9% (69 / 1000)
    uint256 public constant PERCENTAGE_DENOMINATOR = 1000;
    
    // Admin wallet
    address public adminWallet;
    
    // Game administrator addresses
    mapping(address => bool) public gameAdmins;
    
    // 🍊TRAP token address
    address public constant TRAP_TOKEN_ADDRESS = 0x300Ba4799Ab7d6fd55b87BCcBCeCb772b413349b;
    
    // Interface for ERC20 token
    interface IERC20 {
        function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
        function transfer(address recipient, uint256 amount) external returns (bool);
        function balanceOf(address account) external view returns (uint256);
    }
    
    // Game state
    struct Game {
        address player1;
        address player2;
        bool isActive;
        bool isCompleted;
        address winner;
        uint256 prize;
        bool isTokenGame; // Whether the game was paid with tokens
    }
    
    // Mapping from gameId to Game
    mapping(uint256 => Game) public games;
    
    // Pending players waiting for a match (ETH games)
    address public pendingPlayer;
    
    // Pending players waiting for a match (Token games)
    address public pendingTokenPlayer;
    uint256 public pendingTokenAmount; // Amount of tokens paid by the pending player
    
    // Total games created
    uint256 public totalGames;
    
    // Player stats
    struct PlayerStats {
        uint256 gamesPlayed;
        uint256 gamesWon;
        uint256 totalEthEarnings;
        uint256 totalTokenEarnings;
    }
    
    // Mapping from player address to stats
    mapping(address => PlayerStats) public playerStats;
    
    // Events
    event GameCreated(uint256 indexed gameId, address indexed player1, bool isTokenGame);
    event GameStarted(uint256 indexed gameId, address indexed player1, address indexed player2, bool isTokenGame);
    event GameEnded(uint256 indexed gameId, address indexed winner, uint256 prize, bool isTokenGame);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == adminWallet, "Only admin can call this function");
        _;
    }
    
    modifier onlyGameAdmin() {
        require(msg.sender == adminWallet || gameAdmins[msg.sender], "Only game admin can call this function");
        _;
    }
    
    /**
     * @dev Constructor sets the admin wallet and adds it as a game admin
     * @param _adminWallet Address of the admin wallet to receive platform fees
     */
    constructor(address _adminWallet) {
        require(_adminWallet != address(0), "Invalid admin wallet address");
        adminWallet = _adminWallet;
        gameAdmins[_adminWallet] = true; // Admin is also a game admin by default
        emit AdminAdded(_adminWallet);
    }
    
    /**
     * @dev Player enters the game by paying the ETH entry fee
     */
    function enterGame() external payable {
        require(msg.value == ENTRY_FEE, "Incorrect entry fee");
        
        // If there's no pending player, set the current player as pending
        if (pendingPlayer == address(0)) {
            pendingPlayer = msg.sender;
            emit GameCreated(totalGames + 1, msg.sender, false);
        } else {
            // If there's already a pending player, start a new game
            require(pendingPlayer != msg.sender, "You are already in the pending queue");
            
            // Create a new game
            totalGames++;
            uint256 gameId = totalGames;
            
            // Calculate prize pool and platform fee
            uint256 totalPrize = ENTRY_FEE * 2;
            uint256 platformFee = (totalPrize * PLATFORM_FEE_PERCENTAGE) / PERCENTAGE_DENOMINATOR;
            uint256 prize = totalPrize - platformFee;
            
            // Send platform fee to admin wallet
            (bool success, ) = adminWallet.call{value: platformFee}("");
            require(success, "Failed to send platform fee");
            
            // Create game
            games[gameId] = Game({
                player1: pendingPlayer,
                player2: msg.sender,
                isActive: true,
                isCompleted: false,
                winner: address(0),
                prize: prize,
                isTokenGame: false
            });
            
            // Update player stats
            playerStats[pendingPlayer].gamesPlayed++;
            playerStats[msg.sender].gamesPlayed++;
            
            // Reset pending player
            pendingPlayer = address(0);
            
            // Emit event
            emit GameStarted(gameId, games[gameId].player1, games[gameId].player2, false);
        }
    }
    
    /**
     * @dev Player enters the game by paying with 🍊TRAP tokens
     * @param amount The amount of tokens to pay (dynamically calculated based on ETH equivalent)
     */
    function enterGameWithToken(uint256 amount) external {
        // Get token contract
        IERC20 token = IERC20(TRAP_TOKEN_ADDRESS);
        
        // Check if player has enough tokens
        require(token.balanceOf(msg.sender) >= amount, "Insufficient token balance");
        
        // Transfer tokens from player to contract
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        
        // If there's no pending token player, set the current player as pending
        if (pendingTokenPlayer == address(0)) {
            pendingTokenPlayer = msg.sender;
            pendingTokenAmount = amount;
            emit GameCreated(totalGames + 1, msg.sender, true);
        } else {
            // If there's already a pending player, start a new game
            require(pendingTokenPlayer != msg.sender, "You are already in the pending token queue");
            
            // Create a new game
            totalGames++;
            uint256 gameId = totalGames;
            
            // Calculate prize pool and platform fee
            uint256 totalPrize = pendingTokenAmount + amount;
            uint256 platformFee = (totalPrize * PLATFORM_FEE_PERCENTAGE) / PERCENTAGE_DENOMINATOR;
            uint256 prize = totalPrize - platformFee;
            
            // Send platform fee to admin wallet
            require(token.transfer(adminWallet, platformFee), "Failed to send platform fee");
            
            // Create game
            games[gameId] = Game({
                player1: pendingTokenPlayer,
                player2: msg.sender,
                isActive: true,
                isCompleted: false,
                winner: address(0),
                prize: prize,
                isTokenGame: true
            });
            
            // Update player stats
            playerStats[pendingTokenPlayer].gamesPlayed++;
            playerStats[msg.sender].gamesPlayed++;
            
            // Reset pending token player
            pendingTokenPlayer = address(0);
            pendingTokenAmount = 0;
            
            // Emit event
            emit GameStarted(gameId, games[gameId].player1, games[gameId].player2, true);
        }
    }
    
    /**
     * @dev End a game and declare a winner (only callable by game admins)
     * @param gameId ID of the game to end
     * @param winner Address of the winner
     */
    function endGame(uint256 gameId, address winner) external onlyGameAdmin {
        Game storage game = games[gameId];
        
        require(game.isActive, "Game is not active");
        require(!game.isCompleted, "Game is already completed");
        require(winner == game.player1 || winner == game.player2, "Invalid winner");
        
        // Update game state
        game.isActive = false;
        game.isCompleted = true;
        game.winner = winner;
        
        // Update player stats
        playerStats[winner].gamesWon++;
        
        if (game.isTokenGame) {
            // Update token earnings
            playerStats[winner].totalTokenEarnings += game.prize;
            
            // Send token prize to winner
            IERC20 token = IERC20(TRAP_TOKEN_ADDRESS);
            require(token.transfer(winner, game.prize), "Failed to send token prize to winner");
        } else {
            // Update ETH earnings
            playerStats[winner].totalEthEarnings += game.prize;
            
            // Send ETH prize to winner
            (bool success, ) = winner.call{value: game.prize}("");
            require(success, "Failed to send ETH prize to winner");
        }
        
        // Emit event
        emit GameEnded(gameId, winner, game.prize, game.isTokenGame);
    }
    
    /**
     * @dev Get player stats
     * @param player Address of the player
     * @return gamesPlayed Number of games played
     * @return gamesWon Number of games won
     * @return totalEthEarnings Total ETH earnings in wei
     * @return totalTokenEarnings Total token earnings
     */
    function getPlayerStats(address player) external view returns (
        uint256 gamesPlayed,
        uint256 gamesWon,
        uint256 totalEthEarnings,
        uint256 totalTokenEarnings
    ) {
        PlayerStats storage stats = playerStats[player];
        return (stats.gamesPlayed, stats.gamesWon, stats.totalEthEarnings, stats.totalTokenEarnings);
    }
    
    /**
     * @dev Cancel pending ETH game and refund entry fee (only if you're the pending player)
     */
    function cancelPendingGame() external {
        require(pendingPlayer == msg.sender, "You are not the pending player");
        
        // Reset pending player
        pendingPlayer = address(0);
        
        // Refund entry fee
        (bool success, ) = msg.sender.call{value: ENTRY_FEE}("");
        require(success, "Failed to refund entry fee");
    }
    
    /**
     * @dev Cancel pending token game and refund entry fee (only if you're the pending token player)
     */
    function cancelPendingTokenGame() external {
        require(pendingTokenPlayer == msg.sender, "You are not the pending token player");
        
        // Reset pending token player
        pendingTokenPlayer = address(0);
        
        // Refund token entry fee
        IERC20 token = IERC20(TRAP_TOKEN_ADDRESS);
        require(token.transfer(msg.sender, pendingTokenAmount), "Failed to refund token entry fee");
    }
    
    /**
     * @dev Add a new game admin (only callable by admin)
     * @param newAdmin Address of the new game admin
     */
    function addGameAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        require(!gameAdmins[newAdmin], "Address is already a game admin");
        
        gameAdmins[newAdmin] = true;
        emit AdminAdded(newAdmin);
    }
    
    /**
     * @dev Remove a game admin (only callable by admin)
     * @param admin Address of the game admin to remove
     */
    function removeGameAdmin(address admin) external onlyAdmin {
        require(admin != adminWallet, "Cannot remove main admin");
        require(gameAdmins[admin], "Address is not a game admin");
        
        gameAdmins[admin] = false;
        emit AdminRemoved(admin);
    }
    
    /**
     * @dev Check if an address is a game admin
     * @param admin Address to check
     * @return bool True if the address is a game admin
     */
    function isGameAdmin(address admin) external view returns (bool) {
        return gameAdmins[admin];
    }
    
    /**
     * @dev Update admin wallet (only callable by current admin)
     * @param newAdminWallet New admin wallet address
     */
    function updateAdminWallet(address newAdminWallet) external onlyAdmin {
        require(newAdminWallet != address(0), "Invalid admin wallet address");
        
        // Add new admin to game admins
        gameAdmins[newAdminWallet] = true;
        emit AdminAdded(newAdminWallet);
        
        // Remove old admin from game admins if it's not already a game admin
        if (adminWallet != newAdminWallet && !gameAdmins[adminWallet]) {
            gameAdmins[adminWallet] = false;
            emit AdminRemoved(adminWallet);
        }
        
        // Update admin wallet
        adminWallet = newAdminWallet;
    }
    
    /**
     * @dev Withdraw ETH in case of emergency (only callable by admin)
     */
    function emergencyWithdrawETH() external onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        (bool success, ) = adminWallet.call{value: balance}("");
        require(success, "Failed to withdraw ETH");
    }
    
    /**
     * @dev Withdraw tokens in case of emergency (only callable by admin)
     */
    function emergencyWithdrawTokens() external onlyAdmin {
        IERC20 token = IERC20(TRAP_TOKEN_ADDRESS);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        
        require(token.transfer(adminWallet, balance), "Failed to withdraw tokens");
    }
} 