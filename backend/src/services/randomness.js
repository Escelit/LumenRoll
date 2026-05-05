const crypto = require('crypto');
const { createCipheriv, createDecipheriv, randomBytes } = require('crypto');

class RandomnessService {
  constructor() {
    this.encryptionKey = process.env.SECRET_STORE_ENCRYPTION_KEY;
    
    if (!this.encryptionKey) {
      console.warn('SECRET_STORE_ENCRYPTION_KEY not set, using insecure storage');
      this.encryptionKey = randomBytes(32); // Fallback for development
    }
    
    // In production, this would be a database
    this.secrets = new Map();
  }

  // Generate cryptographically secure random secret and commit
  async generateCommit() {
    const secret = randomBytes(32);
    const commit = crypto.createHash('sha256').update(secret).digest();
    
    return {
      secret: secret.toString('hex'),
      commit: commit.toString('hex')
    };
  }

  // Store encrypted secret for later use
  async storeSecret(gameId, secret) {
    try {
      const iv = randomBytes(16);
      const cipher = createCipheriv('aes-256-cbc', Buffer.from(this.encryptionKey, 'hex'), iv);
      
      let encrypted = cipher.update(secret, 'hex', 'hex');
      encrypted += cipher.final('hex');
      
      const storedData = {
        encrypted,
        iv: iv.toString('hex'),
        timestamp: Date.now()
      };
      
      this.secrets.set(gameId.toString(), storedData);
      
      return true;
    } catch (error) {
      console.error('Failed to store secret:', error);
      return false;
    }
  }

  // Retrieve and decrypt stored secret
  async getSecret(gameId) {
    try {
      const storedData = this.secrets.get(gameId.toString());
      
      if (!storedData) {
        return null;
      }
      
      const decipher = createDecipheriv(
        'aes-256-cbc', 
        Buffer.from(this.encryptionKey, 'hex'), 
        Buffer.from(storedData.iv, 'hex')
      );
      
      let decrypted = decipher.update(storedData.encrypted, 'hex', 'hex');
      decrypted += decipher.final('hex');
      
      return decrypted;
    } catch (error) {
      console.error('Failed to retrieve secret:', error);
      return null;
    }
  }

  // Delete stored secret
  async deleteSecret(gameId) {
    return this.secrets.delete(gameId.toString());
  }

  // Get all stored secrets (admin only)
  async getAllSecrets() {
    const secrets = {};
    
    for (const [gameId, data] of this.secrets.entries()) {
      secrets[gameId] = {
        ...data,
        encrypted: data.encrypted.substring(0, 16) + '...' // Partially hide for security
      };
    }
    
    return secrets;
  }

  // Clean up old secrets (older than 24 hours)
  async cleanupOldSecrets() {
    const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
    let cleaned = 0;
    
    for (const [gameId, data] of this.secrets.entries()) {
      if (data.timestamp < cutoff) {
        this.secrets.delete(gameId);
        cleaned++;
      }
    }
    
    console.log(`Cleaned up ${cleaned} old secrets`);
    return cleaned;
  }

  // Verify commit matches secret
  verifyCommit(secret, commit) {
    const computedCommit = crypto.createHash('sha256').update(Buffer.from(secret, 'hex')).digest();
    const computedCommitHex = computedCommit.toString('hex');
    
    return computedCommitHex === commit;
  }

  // Generate deterministic seed from two secrets
  generateSeed(secret1, secret2) {
    const combined = Buffer.concat([
      Buffer.from(secret1, 'hex'),
      Buffer.from(secret2, 'hex')
    ]);
    
    return crypto.createHash('sha256').update(combined).digest();
  }

  // Generate dice roll from seed
  generateDiceRoll(seed) {
    // Use first byte of hash for dice roll (1-6)
    const roll = (seed[0] % 6) + 1;
    return roll;
  }

  // Validate secret format
  validateSecret(secret) {
    try {
      const buffer = Buffer.from(secret, 'hex');
      return buffer.length === 32; // Should be 32 bytes
    } catch (error) {
      return false;
    }
  }

  // Generate multiple secrets for batch processing
  async generateMultipleCommits(count) {
    const commits = [];
    
    for (let i = 0; i < count; i++) {
      const { secret, commit } = await this.generateCommit();
      commits.push({ secret, commit, index: i });
    }
    
    return commits;
  }

  // Get storage statistics
  getStorageStats() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    const oneDay = 24 * oneHour;
    
    let recent = 0;
    let old = 0;
    
    for (const data of this.secrets.values()) {
      if (now - data.timestamp < oneHour) {
        recent++;
      } else if (now - data.timestamp < oneDay) {
        old++;
      }
    }
    
    return {
      total: this.secrets.size,
      recent,
      old,
      oldest: Math.min(...Array.from(this.secrets.values()).map(d => d.timestamp)),
      newest: Math.max(...Array.from(this.secrets.values()).map(d => d.timestamp))
    };
  }
}

// Schedule cleanup every hour
const randomnessService = new RandomnessService();
setInterval(() => {
  randomnessService.cleanupOldSecrets();
}, 60 * 60 * 1000); // 1 hour

module.exports = randomnessService;
