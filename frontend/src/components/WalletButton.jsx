import React, { useState } from 'react';
import { Wallet, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const WalletButton = ({ onConnect }) => {
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    const dummyAddress = "GDFX...3Y7Z"; 
    setAddress(dummyAddress);
    onConnect(dummyAddress);
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={connectWallet}
      className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 ${
        address 
          ? 'bg-secondary text-black shadow-lg shadow-secondary/20' 
          : 'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      {address ? (
        <>
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-mono">{address}</span>
        </>
      ) : (
        <>
          <Wallet className="w-5 h-5" />
          Connect Wallet
        </>
      )}
    </motion.button>
  );
};

export default WalletButton;
