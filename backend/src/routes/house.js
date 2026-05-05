const express = require('express');
const router = express.Router();
const contractService = require('../services/contract');
const randomnessService = require('../services/randomness');
const stellarService = require('../services/stellar');

// POST /api/house/commit - Submit house commit for a game
router.post('/commit', async (req, res) => {
  try {
    const { game_id } = req.body;

    if (!game_id) {
      return res.status(400).json({ error: 'game_id is required' });
    }

    // Generate house secret and commit
    const { secret, commit } = await randomnessService.generateCommit();
    
    // Store secret encrypted for later reveal
    await randomnessService.storeSecret(game_id, secret);

    // Submit commit to contract
    const txResult = await stellarService.submitHouseCommit(game_id, commit);

    res.json({
      game_id,
      house_commit: commit,
      transaction_hash: txResult.hash,
      status: 'committed'
    });

  } catch (error) {
    console.error('House commit error:', error);
    res.status(500).json({ error: 'Failed to submit house commit' });
  }
});

// POST /api/house/reveal - Reveal house secret for a game
router.post('/reveal', async (req, res) => {
  try {
    const { game_id, player_secret } = req.body;

    if (!game_id || !player_secret) {
      return res.status(400).json({ 
        error: 'game_id and player_secret are required' 
      });
    }

    // Get stored house secret
    const houseSecret = await randomnessService.getSecret(game_id);
    
    if (!houseSecret) {
      return res.status(404).json({ error: 'House secret not found' });
    }

    // Call reveal on contract
    const revealResult = await contractService.revealGame(game_id, player_secret, houseSecret);

    // Clean up stored secrets
    await randomnessService.deleteSecret(game_id);

    res.json({
      game_id,
      roll: revealResult.roll,
      won: revealResult.won,
      payout: revealResult.payout.toString(),
      transaction_hash: revealResult.tx_hash
    });

  } catch (error) {
    console.error('House reveal error:', error);
    res.status(500).json({ error: 'Failed to reveal house secret' });
  }
});

// GET /api/house/secrets - Get stored house secrets (admin only)
router.get('/secrets', async (req, res) => {
  try {
    // TODO: Add authentication for admin access
    const secrets = await randomnessService.getAllSecrets();
    res.json({ secrets });

  } catch (error) {
    console.error('Get secrets error:', error);
    res.status(500).json({ error: 'Failed to fetch secrets' });
  }
});

// POST /api/house/claim-expired - Claim expired games
router.post('/claim-expired', async (req, res) => {
  try {
    const { game_id } = req.body;

    if (!game_id) {
      return res.status(400).json({ error: 'game_id is required' });
    }

    const txResult = await stellarService.claimExpired(game_id);

    res.json({
      game_id,
      transaction_hash: txResult.hash,
      status: 'claimed'
    });

  } catch (error) {
    console.error('Claim expired error:', error);
    res.status(500).json({ error: 'Failed to claim expired game' });
  }
});

// GET /api/house/balance - Get house contract balance
router.get('/balance', async (req, res) => {
  try {
    const balance = await contractService.getHouseBalance();
    res.json({ balance: balance.toString() });

  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({ error: 'Failed to fetch house balance' });
  }
});

module.exports = router;
