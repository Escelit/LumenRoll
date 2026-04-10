import React, { useState } from 'react';
import WalletButton from './components/WalletButton';

function App() {
  const [address, setAddress] = useState(null);
  const [betAmount, setBetAmount] = useState("10");
  const [guess, setGuess] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-teal-400 rounded-lg animate-float"></div>
          <h1 className="text-2xl font-bold tracking-tight">LumenRoll</h1>
        </div>
        <WalletButton onConnect={setAddress} />
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Game Board */}
        <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-6xl mb-8">🎲</div>
          <p className="text-text-dim text-center mb-6">
            Pick a number and roll the dice. <br/> 
            5x payout on successful hits.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button 
                key={num}
                onClick={() => setGuess(num)}
                className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                  guess === num ? 'border-accent-primary bg-accent-primary/20' : 'border-glass-border hover:border-text-dim'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button className="btn-primary w-full py-4 text-lg">
            Place Bet
          </button>
        </div>

        {/* Stats & History */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-text-dim">Total Wagered</p>
                <p className="text-xl font-bold">0.00 XLM</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-text-dim">Net Profit</p>
                <p className="text-xl font-bold text-teal-400">+0.00</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 flex-grow">
            <h3 className="text-lg font-semibold mb-4">Live Activity</h3>
            <div className="space-y-4">
              <p className="text-text-dim text-sm italic">Waiting for games...</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 text-text-dim text-sm">
        Built on Stellar • Powered by Soroban
      </footer>
    </div>
  );
}

export default App;
import React, { useState } from 'react';
import WalletButton from './components/WalletButton';

function App() {
  const [address, setAddress] = useState(null);
  const [betAmount, setBetAmount] = useState("10");
  const [guess, setGuess] = useState(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <header className="w-full max-w-6xl flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-teal-400 rounded-lg animate-float"></div>
          <h1 className="text-2xl font-bold tracking-tight">LumenRoll</h1>
        </div>
        <WalletButton onConnect={setAddress} />
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Game Board */}
        <div className="glass-card p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-6xl mb-8">🎲</div>
          <p className="text-text-dim text-center mb-6">
            Pick a number and roll the dice. <br/> 
            5x payout on successful hits.
          </p>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button 
                key={num}
                onClick={() => setGuess(num)}
                className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center text-xl font-bold transition-all ${
                  guess === num ? 'border-accent-primary bg-accent-primary/20' : 'border-glass-border hover:border-text-dim'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          <button className="btn-primary w-full py-4 text-lg">
            Place Bet
          </button>
        </div>

        {/* Stats & History */}
        <div className="flex flex-col gap-6">
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-text-dim">Total Wagered</p>
                <p className="text-xl font-bold">0.00 XLM</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-text-dim">Net Profit</p>
                <p className="text-xl font-bold text-teal-400">+0.00</p>
              </div>
            </div>
