import React, { useState } from 'react';

const WalletButton = ({ onConnect }) => {
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    // Integration logic for @stellar/freighter-api goes here
    const dummyAddress = "G...ABCD"; 
    setAddress(dummyAddress);
    onConnect(dummyAddress);
  };

  return (
    <button 
      onClick={connectWallet}
      className="btn-primary flex items-center gap-2"
    >
      {address ? (
        <>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          {address.slice(0, 4)}...{address.slice(-4)}
        </>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
};

export default WalletButton;
import React, { useState } from 'react';

const WalletButton = ({ onConnect }) => {
  const [address, setAddress] = useState(null);

  const connectWallet = async () => {
    // Integration logic for @stellar/freighter-api goes here
    const dummyAddress = "G...ABCD"; 
    setAddress(dummyAddress);
    onConnect(dummyAddress);
  };

  return (
    <button 
      onClick={connectWallet}
      className="btn-primary flex items-center gap-2"
    >
      {address ? (
        <>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          {address.slice(0, 4)}...{address.slice(-4)}
        </>
      ) : (
        "Connect Wallet"
      )}
    </button>
  );
};

