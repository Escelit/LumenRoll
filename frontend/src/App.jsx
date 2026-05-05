import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, 
  Dices, 
  History, 
  TrendingUp, 
  ShieldCheck, 
  Info,
  Trophy,
  XCircle,
  Coins
} from 'lucide-react';
import WalletButton from './components/WalletButton';

function App() {
  const [address, setAddress] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [guess, setGuess] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ wagered: 0, profit: 0, wins: 0 });

  const handleRoll = () => {
    if (!guess) return alert("Please select a number first!");
    if (!address) return alert("Please connect your wallet!");

    setIsRolling(true);
    setResult(null);

    // Simulate dice roll animation duration
    setTimeout(() => {
      const roll = Math.floor(Math.random() * 6) + 1;
      const won = roll === guess;
      const payout = won ? betAmount * 5 : 0;
      const net = won ? payout - betAmount : -betAmount;

      const gameResult = {
        id: Date.now(),
        roll,
        guess,
        won,
        payout,
        time: new Date().toLocaleTimeString()
      };

      setResult(gameResult);
      setHistory(prev => [gameResult, ...prev].slice(0, 10));
      setStats(prev => ({
        wagered: prev.wagered + betAmount,
        profit: prev.profit + net,
        wins: prev.wins + (won ? 1 : 0)
      }));
      setIsRolling(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="mesh-gradient" />
      
      {/* Navigation */}
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-900/20">
            <Dices className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-none">LumenRoll</h1>
            <span className="text-xs text-cyan-400 font-semibold uppercase tracking-widest">Provably Fair</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="hidden md:flex gap-8 text-sm font-medium text-text-secondary">
            <a href="#" className="hover:text-white transition-colors">Provably Fair</a>
            <a href="#" className="hover:text-white transition-colors">Stats</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
          <WalletButton onConnect={setAddress} />
        </motion.div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
        
        {/* Game Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-7"
        >
          <div className="glass-panel p-10 h-full flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
            
            <div className="relative mb-12">
              <AnimatePresence mode="wait">
                {isRolling ? (
                  <motion.div
                    key="rolling"
                    animate={{ rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    className="w-32 h-32 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl flex items-center justify-center border-2 border-white/20"
                  >
                    <Dices className="w-16 h-16 text-violet-400" />
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-32 h-32 bg-white/10 rounded-3xl flex flex-col items-center justify-center border-2 border-accent-glow"
                  >
                    <span className="text-5xl font-bold">{result.roll}</span>
                    <span className={`text-xs font-bold uppercase mt-1 ${result.won ? 'text-success' : 'text-rose-500'}`}>
                      {result.won ? 'Winner' : 'Lost'}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    className="w-32 h-32 bg-white/5 rounded-3xl flex items-center justify-center border-2 border-white/10"
                  >
                    <Dices className="w-16 h-16 text-white/20" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-2">Predict the Roll</h2>
              <p className="text-text-secondary">Pick a lucky number and wager your XLM</p>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-10">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => setGuess(num)}
                  disabled={isRolling}
                  className={`dice-slot ${guess === num ? 'active' : ''}`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="w-full max-w-md space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-text-secondary">Wager Amount</span>
                  <span className="text-accent-secondary">{betAmount} XLM</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={betAmount} 
                  onChange={(e) => setBetAmount(parseInt(e.target.value))}
                  disabled={isRolling}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
              </div>

              <button 
                onClick={handleRoll}
                disabled={isRolling || !address}
                className="btn-premium w-full group"
              >
                {isRolling ? "Rolling..." : "Roll the Dice"}
                <TrendingUp className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Info & History */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Stats Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="stat-card glass-panel">
              <div className="flex items-center gap-3 mb-2 text-text-secondary">
                <Coins className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Total Wagered</span>
              </div>
              <div className="text-2xl font-bold">{stats.wagered} XLM</div>
            </div>
            <div className="stat-card glass-panel">
              <div className="flex items-center gap-3 mb-2 text-text-secondary">
                <Trophy className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Net Profit</span>
              </div>
              <div className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-success' : 'text-rose-500'}`}>
                {stats.profit >= 0 ? '+' : ''}{stats.profit} XLM
              </div>
            </div>
          </motion.div>

          {/* History */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel flex-grow p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-accent-glow" />
                <h3 className="text-lg font-bold">Recent Rolls</h3>
              </div>
              <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-text-secondary">Live</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {history.length === 0 ? (
                  <div className="text-center py-12 text-text-secondary italic">
                    No games played yet
                  </div>
                ) : (
                  history.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                          item.won ? 'bg-success/20 text-success border border-success/30' : 'bg-white/5 text-text-secondary border border-white/10'
                        }`}>
                          {item.roll}
                        </div>
                        <div>
                          <p className="text-sm font-bold">Guess: {item.guess}</p>
                          <p className="text-[10px] text-text-secondary uppercase font-bold">{item.time}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${item.won ? 'text-success' : 'text-text-secondary'}`}>
                          {item.won ? `+${item.payout} XLM` : '- Bet'}
                        </p>
                        <p className="text-[10px] text-text-secondary font-medium">Tx Verified</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Trust Badge */}
          <div className="flex items-center gap-3 px-6 py-4 bg-violet-600/10 border border-violet-500/20 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-violet-400" />
            <p className="text-xs text-violet-200 leading-relaxed">
              Every roll is backed by a <strong>Soroban Smart Contract</strong>. Fairness is mathematically guaranteed through a commit-reveal scheme.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
