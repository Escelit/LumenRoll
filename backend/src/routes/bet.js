const express = require('express');
const router = express.Router();
const contractService = require('../services/contract');
const stellarService = require('../services/stellar');

// POST /api/bet - Place a new bet
router.post('/', async (req, res) => {
  try {
    const { player_address, bet_amount, player_guess, player_commit, signed_xdr } = req.body;

    // Validate input
    if (!player_address || !bet_amount || !player_guess || !player_commit || !signed_xdr) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['player_address', 'bet_amount', 'player_guess', 'player_commit', 'signed_xdr']
      });
    }

    // Validate bet amount (minimum 0.1 XLM = 1,000,000 stroops)
    if (parseInt(bet_amount) < 1000000) {
      return res.status(400).json({ error: 'Minimum bet is 0.1 XLM' });
    }

    // Validate guess
    if (player_guess < 1 || player_guess > 6) {
      return res.status(400).json({ error: 'Guess must be between 1 and 6' });
    }

    // Submit transaction to Stellar
    const txResult = await stellarService.submitTransaction(signed_xdr);
    
    if (!txResult.success) {
      return res.status(400).json({ 
        error: 'Transaction failed', 
        details: txResult.error 
      });
    }

    // Extract game_id from transaction result
    const gameId = await contractService.getLatestGameId();

    // Trigger house commit (async)
    setImmediate(async () => {
      try {
        await stellarService.submitHouseCommit(gameId);
      } catch (error) {
        console.error('House commit failed:', error);
      }
    });

    res.json({
      game_id: gameId.toString(),
      status: 'waiting_for_reveal',
      house_committed: true,
      transaction_hash: txResult.hash
    });

  } catch (error) {
    console.error('Bet placement error:', error);
    res.status(500).json({ error: 'Failed to place bet' });
  }
});

// POST /api/bet/:gameId/reveal - Reveal player secret
router.post('/:gameId/reveal', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { player_secret } = req.body;

    if (!player_secret) {
      return res.status(400).json({ error: 'player_secret is required' });
    }

    // Get house secret for this game
    const houseSecret = await stellarService.getHouseSecret(gameId);
    
    if (!houseSecret) {
      return res.status(404).json({ error: 'Game not found or house secret not available' });
    }

    // Call reveal on contract
    const revealResult = await contractService.revealGame(gameId, player_secret, houseSecret);

    res.json({
      game_id: gameId,
      roll: revealResult.roll,
      player_guess: revealResult.player_guess,
      won: revealResult.won,
      payout: revealResult.payout.toString(),
      transaction_hash: revealResult.tx_hash
    });

  } catch (error) {
    console.error('Reveal error:', error);
    res.status(500).json({ error: 'Failed to reveal game' });
  }
});

// GET /api/bet/:gameId - Get game status
router.get('/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await contractService.getGame(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    res.json({
      game_id: gameId,
      player: game.player,
      bet_amount: game.bet_amount.toString(),
      player_guess: game.player_guess,
      status: game.status,
      roll: game.roll,
      won: game.won,
      payout: game.payout ? game.payout.toString() : null,
      created_at: game.created_at,
      resolved_at: game.resolved_at
    });

  } catch (error) {
    console.error('Get game error:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
});

module.exports = router;
