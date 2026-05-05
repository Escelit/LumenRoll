const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const betRoutes = require('./routes/bet');
const houseRoutes = require('./routes/house');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/bet', betRoutes);
app.use('/api/house', houseRoutes);

// Stats endpoint
app.get('/api/stats', async (req, res) => {
  try {
    // TODO: Implement actual stats from database
    res.json({
      total_games: 0,
      total_volume: '0',
      house_profit: '0',
      win_rate: 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// History endpoint
app.get('/api/history', async (req, res) => {
  try {
    // TODO: Implement actual history from database
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`LumenRoll backend running on port ${PORT}`);
  console.log(`Environment: ${process.env.STELLAR_NETWORK || 'testnet'}`);
});
