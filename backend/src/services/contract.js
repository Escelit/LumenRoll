const { Server, Networks } = require('@stellar/stellar-sdk');

class ContractService {
  constructor() {
    this.server = new Server(process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org');
    this.network = process.env.STELLAR_NETWORK === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
    this.contractId = process.env.CONTRACT_ID;
    
    if (!this.contractId) {
      throw new Error('CONTRACT_ID environment variable is required');
    }
  }

  // Get game data from contract
  async getGame(gameId) {
    try {
      // In a real implementation, this would call the contract's get_game function
      // For now, return mock data structure
      return {
        player: 'GDFX...3Y7Z',
        bet_amount: 10000000, // 1 XLM in stroops
        player_guess: 4,
        status: 'resolved',
        roll: 4,
        won: true,
        payout: 50000000, // 5 XLM in stroops
        created_at: new Date().toISOString(),
        resolved_at: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to get game ${gameId}: ${error.message}`);
    }
  }

  // Get latest game ID
  async getLatestGameId() {
    try {
      // In a real implementation, this would query the contract
      // For now, return a mock ID
      return Date.now();
    } catch (error) {
      throw new Error(`Failed to get latest game ID: ${error.message}`);
    }
  }

  // Reveal game result
  async revealGame(gameId, playerSecret, houseSecret) {
    try {
      // In a real implementation, this would call the contract's reveal function
      // For now, simulate the reveal logic
      
      // Compute XOR of secrets (mock implementation)
      const seed = this.xorSecrets(playerSecret, houseSecret);
      const roll = (seed % 6) + 1;
      
      // Mock game data to determine if player won
      const mockGame = await this.getGame(gameId);
      const won = roll === mockGame.player_guess;
      const payout = won ? mockGame.bet_amount * 5 : 0;

      return {
        roll,
        won,
        payout,
        player_guess: mockGame.player_guess,
        tx_hash: 'mock_tx_hash_' + Date.now()
      };
    } catch (error) {
      throw new Error(`Failed to reveal game ${gameId}: ${error.message}`);
    }
  }

  // Get house contract balance
  async getHouseBalance() {
    try {
      // In a real implementation, this would query the contract's balance
      // For now, return mock balance
      return 1000000000; // 100 XLM in stroops
    } catch (error) {
      throw new Error(`Failed to get house balance: ${error.message}`);
    }
  }

  // Get contract configuration
  async getContractConfig() {
    try {
      // In a real implementation, this would get house and token addresses
      return {
        house: process.env.HOUSE_ADDRESS || 'GDFX...3Y7Z',
        token: process.env.TOKEN_CONTRACT_ID || 'native',
        min_bet: 1000000, // 0.1 XLM
        payout_multiplier: 5
      };
    } catch (error) {
      throw new Error(`Failed to get contract config: ${error.message}`);
    }
  }

  // Check if contract is initialized
  async isInitialized() {
    try {
      const config = await this.getContractConfig();
      return config.house !== null;
    } catch (error) {
      return false;
    }
  }

  // Get game statistics
  async getGameStats() {
    try {
      // In a real implementation, this would query contract events
      return {
        total_games: 0,
        total_volume: 0,
        house_profit: 0,
        active_games: 0
      };
    } catch (error) {
      throw new Error(`Failed to get game stats: ${error.message}`);
    }
  }

  // Helper method to XOR two secrets (simplified)
  xorSecrets(secret1, secret2) {
    // Convert hex strings to buffers
    const buf1 = Buffer.from(secret1, 'hex');
    const buf2 = Buffer.from(secret2, 'hex');
    
    // XOR operation
    const result = Buffer.alloc(Math.min(buf1.length, buf2.length));
    for (let i = 0; i < result.length; i++) {
      result[i] = buf1[i] ^ buf2[i];
    }
    
    // Return first byte as number (0-255)
    return result[0];
  }

  // Validate game parameters
  validateGameParams(betAmount, guess) {
    const errors = [];

    if (betAmount < 1000000) {
      errors.push('Minimum bet is 0.1 XLM (1,000,000 stroops)');
    }

    if (guess < 1 || guess > 6) {
      errors.push('Guess must be between 1 and 6');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Simulate contract call (for development)
  async simulateContractCall(functionName, args) {
    console.log(`Simulating contract call: ${functionName}`, args);
    
    switch (functionName) {
      case 'place_bet':
        return { success: true, game_id: Date.now() };
      case 'house_commit':
        return { success: true, transaction_hash: 'mock_hash_' + Date.now() };
      case 'reveal':
        return { success: true, roll: Math.floor(Math.random() * 6) + 1 };
      case 'claim_expired':
        return { success: true, refunded: true };
      default:
        throw new Error(`Unknown function: ${functionName}`);
    }
  }
}

module.exports = new ContractService();
