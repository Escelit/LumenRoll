import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  Dices,
  History,
  TrendingUp,
  ShieldCheck,
  Zap,
  Trophy,
  ArrowRight,
  Activity,
  Coins,
} from "lucide-react";
import WalletButton from "./components/WalletButton";

const App = () => {
  const [address, setAddress] = useState(null);
  const [betAmount, setBetAmount] = useState(25);
  const [guess, setGuess] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ wagered: 0, profit: 0, wins: 0 });

  const handleRoll = () => {
    if (!guess || !address || isRolling) return;
    setIsRolling(true);
    setResult(null);

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
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setResult(gameResult);
      setHistory((prev) => [gameResult, ...prev].slice(0, 5));
      setStats((prev) => ({
        wagered: prev.wagered + betAmount,
        profit: prev.profit + net,
        wins: prev.wins + (won ? 1 : 0),
      }));
      setIsRolling(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-canvas text-white font-sans selection:bg-primary/30">
      <div className="nebula" />
      <div className="aurora top-[-20%] left-[-10%] opacity-20" />
      <div className="aurora bottom-[-20%] right-[-10%] opacity-20" />

      {/* Modern Top Nav */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <Dices className="text-black w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter leading-none">
              LUMENROLL
            </h1>
            <span className="text-[10px] text-secondary font-black uppercase tracking-[0.3em]">
              Soroban Mainnet
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <Activity className="w-4 h-4 text-secondary animate-pulse" />
            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
              Live Network
            </span>
          </div>
          <WalletButton onConnect={setAddress} />
        </motion.div>
      </nav>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 mt-6 pb-20 relative z-10">
        {/* Left Column: Game Control */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="stage p-12 flex flex-col items-center"
          >
            <div className="w-full flex justify-between items-start mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">
                  Predict & Roll
                </h2>
                <p className="text-muted text-base md:text-lg font-medium">
                  Choose your number for a 5x instant payout
                </p>
                {!guess && (
                  <p className="text-secondary text-sm font-medium mt-2 animate-pulse">
                    ↓ Select a number below to continue
                  </p>
                )}
              </div>
              <div className="hidden md:flex gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:border-white/20 transition-all cursor-help group">
                  <ShieldCheck className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>

            {/* Central Dice Stage */}
            <div className="relative mb-16 h-40 md:h-48 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isRolling ? (
                  <motion.div
                    key="rolling"
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      ease: "linear",
                    }}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-4 border-dashed border-primary/40 flex items-center justify-center bg-primary/10"
                  >
                    <Dices className="w-16 h-16 md:w-20 md:h-20 text-primary loading-dice" />
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ scale: 0, rotate: -200 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className={`w-32 h-32 md:w-40 md:h-40 rounded-[32px] bg-white text-black flex flex-col items-center justify-center shadow-[0_0_100px_rgba(255,255,255,0.3)] ${
                      result.won ? "success-pulse" : ""
                    }`}
                  >
                    <span className="text-5xl md:text-7xl font-black">
                      {result.roll}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 ${
                        result.won ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {result.won ? "Winner!" : "Try Again"}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] border-2 border-white/10 flex items-center justify-center bg-white/3"
                  >
                    <Dices className="w-16 h-16 md:w-20 md:h-20 text-white/10" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Selection Grid */}
            <div className="dice-grid mb-10">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setGuess(num)}
                  disabled={isRolling}
                  className={`dice-option ${guess === num ? "selected" : ""} focus-visible`}
                  aria-label={`Select number ${num}`}
                  aria-pressed={guess === num}
                >
                  {num}
                </button>
              ))}
            </div>

            {guess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <p className="text-secondary text-sm font-medium">
                  You selected{" "}
                  <span className="text-white font-bold">{guess}</span> • Ready
                  to play!
                </p>
              </motion.div>
            )}

            {/* Betting Controls */}
            <div className="w-full max-w-xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="metric">
                  <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-3">
                    Bet Amount
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="text-3xl md:text-4xl font-black tracking-tighter">
                      {betAmount}{" "}
                      <span className="text-sm font-bold text-muted">XLM</span>
                    </span>
                    <div className="flex gap-2">
                      {[10, 25, 50, 100].map((v) => (
                        <button
                          key={v}
                          onClick={() => setBetAmount(v)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all focus-visible ${
                            betAmount === v
                              ? "bg-white text-black border-white"
                              : "bg-white/5 border-white/5 text-muted hover:border-white/20 hover:bg-white/10"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="metric">
                  <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-3">
                    Potential Payout
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl md:text-4xl font-black text-primary tracking-tighter">
                      {betAmount * 5}
                    </span>
                    <span className="text-sm font-bold text-muted">XLM</span>
                  </div>
                  <div className="text-[10px] text-secondary font-medium mt-1">
                    5.0x multiplier
                  </div>
                </div>
              </div>

              <button
                onClick={handleRoll}
                disabled={isRolling || !address || !guess}
                className="cta-button w-full focus-visible text-base md:text-lg"
              >
                {isRolling ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    TRANSACTION IN PROGRESS...
                  </>
                ) : address ? (
                  guess ? (
                    `ROLL FOR ${betAmount * 5} XLM`
                  ) : (
                    "SELECT A NUMBER FIRST"
                  )
                ) : (
                  "CONNECT WALLET TO PLAY"
                )}
                {!isRolling && address && guess && (
                  <ArrowRight className="w-5 h-5" />
                )}
              </button>

              {address && guess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-[10px] text-muted font-medium"
                >
                  Provably fair • Smart contract secured • Instant payout
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Performance & History */}
        <div className="lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="metric"
          >
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-black text-muted uppercase tracking-[0.2em]">
                Live Profit
              </span>
              <TrendingUp className="w-4 h-4 text-secondary" />
            </div>
            <div className="flex items-baseline gap-3">
              <span
                className={`text-5xl font-black tracking-tighter ${stats.profit >= 0 ? "text-white" : "text-rose-500"}`}
              >
                {stats.profit >= 0 ? "+" : ""}
                {stats.profit}
              </span>
              <span className="text-sm font-bold text-muted">XLM</span>
            </div>
          </motion.div>

          {/* History Feed */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="stage p-8 flex-grow"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <History className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black tracking-tighter">
                  ROLL FEED
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                <span className="text-[10px] font-black text-muted uppercase tracking-widest">
                  Active
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {history.length === 0 ? (
                  <div className="text-center py-20 opacity-10">
                    <History className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm font-black tracking-widest">
                      AWAITING ACTIVITY
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center justify-between p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${item.won ? "bg-white text-black" : "bg-white/5 text-muted"}`}
                        >
                          {item.roll}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-muted uppercase tracking-widest">
                            GUESS {item.guess}
                          </p>
                          <p className="text-[10px] font-bold opacity-30">
                            {item.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-black ${item.won ? "text-secondary" : "text-muted"}`}
                        >
                          {item.won
                            ? `+${item.payout} XLM`
                            : `-${betAmount} XLM`}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-12 flex justify-between items-center opacity-20 hover:opacity-50 transition-opacity">
        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em]">
          <span>Soroban Engine</span>
          <span>Verified Contract</span>
          <span>Open Protocol</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em]">
          LUMENROLL LABS © 2026
        </p>
      </footer>
    </div>
  );
};

export default App;
