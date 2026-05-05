const { Server, Networks, TransactionBuilder, Operation, Asset, BASE_FEE } = require('@stellar/stellar-sdk');
const crypto = require('crypto');

class StellarService {
  constructor() {
    this.server = new Server(process.env.STELLAR_RPC_URL || 'https://soroban-testnet.stellar.org');
    this.horizon = new Server(process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org');
    this.network = process.env.STELLAR_NETWORK === 'mainnet' ? Networks.PUBLIC : Networks.TESTNET;
    this.houseKeypair = null;
    
    if (process.env.HOUSE_SECRET_KEY) {
      this.houseKeypair = require('@stellar/stellar-sdk').Keypair.fromSecret(process.env.HOUSE_SECRET_KEY);
    }
  }

  // Submit a signed transaction to the network
  async submitTransaction(signedXDR) {
    try {
      const transaction = TransactionBuilder.fromXDR(signedXDR, this.network);
      const result = await this.server.sendTransaction(transaction);
      
      return {
        success: true,
        hash: result.hash,
        ledger: result.latestLedger
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Submit house commit for a game
  async submitHouseCommit(gameId, houseCommit) {
    if (!this.houseKeypair) {
      throw new Error('House keypair not configured');
    }

    try {
      const contractId = process.env.CONTRACT_ID;
      const account = await this.server.getAccount(this.houseKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.network
      })
        .addOperation(Operation.invokeContractFunction({
          contract: contractId,
          function: 'house_commit',
          args: [
            gameId,
            houseCommit
          ]
        }))
        .setTimeout(30)
        .build();

      transaction.sign(this.houseKeypair);
      
      const result = await this.server.sendTransaction(transaction);
      
      return {
        success: true,
        hash: result.hash,
        ledger: result.latestLedger
      };
    } catch (error) {
      throw new Error(`House commit failed: ${error.message}`);
    }
  }

  // Claim expired game
  async claimExpired(gameId) {
    if (!this.houseKeypair) {
      throw new Error('House keypair not configured');
    }

    try {
      const contractId = process.env.CONTRACT_ID;
      const account = await this.server.getAccount(this.houseKeypair.publicKey());
      
      const transaction = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: this.network
      })
        .addOperation(Operation.invokeContractFunction({
          contract: contractId,
          function: 'claim_expired',
          args: [gameId]
        }))
        .setTimeout(30)
        .build();

      transaction.sign(this.houseKeypair);
      
      const result = await this.server.sendTransaction(transaction);
      
      return {
        success: true,
        hash: result.hash,
        ledger: result.latestLedger
      };
    } catch (error) {
      throw new Error(`Claim expired failed: ${error.message}`);
    }
  }

  // Get account balance
  async getBalance(address) {
    try {
      const account = await this.horizon.loadAccount(address);
      const xlmBalance = account.balances.find(b => b.asset_type === 'native');
      return xlmBalance ? parseFloat(xlmBalance.balance) : 0;
    } catch (error) {
      return 0;
    }
  }

  // Get contract state
  async getContractData(key, type = 'stellar') {
    try {
      const contractId = process.env.CONTRACT_ID;
      const ledger = await this.server.getLedger();
      
      // This is a simplified version - in production you'd use proper contract data retrieval
      return null;
    } catch (error) {
      console.error('Failed to get contract data:', error);
      return null;
    }
  }

  // Stream contract events
  streamContractEvents(callback) {
    try {
      const contractId = process.env.CONTRACT_ID;
      
      this.horizon.transactions()
        .forAccount(contractId)
        .cursor('now')
        .stream({
          onmessage: (record) => {
            callback(record);
          },
          onerror: (error) => {
            console.error('Event stream error:', error);
          }
        });
    } catch (error) {
      console.error('Failed to start event stream:', error);
    }
  }

  // Validate transaction
  validateTransaction(xdr) {
    try {
      const transaction = TransactionBuilder.fromXDR(xdr, this.network);
      return {
        valid: true,
        operations: transaction.operations.length,
        source: transaction.source
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  // Get transaction status
  async getTransactionStatus(txHash) {
    try {
      const transaction = await this.horizon.transactions().transaction(txHash).call();
      return {
        successful: transaction.successful,
        ledger: transaction.ledger,
        created_at: transaction.created_at
      };
    } catch (error) {
      return {
        successful: false,
        error: error.message
      };
    }
  }
}

module.exports = new StellarService();
