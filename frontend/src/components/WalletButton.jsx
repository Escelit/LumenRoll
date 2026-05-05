import React, { useState } from 'react';
import { Wallet, LogOut, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WalletButton = ({ onConnect }) => {
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    // Simulated connection for demo
    const dummyAddress = "GDFX...3Y7Z"; 
    setAddress(dummyAddress);
    onConnect(dummyAddress);
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={connectWallet}
      className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-3 ${
        address 
          ? 'bg-success/10 text-success border border-success/20' 
          : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'
      }`}
    >
      {address ? (
        <>
          <CheckCircle2 className="w-4 h-4" />
          <span className="tracking-tight">{address}</span>
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </>
      )}
    </motion.button>
  );
};

export default WalletButton;
