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

export default WalletButton;
// touch 96
// touch 97
// touch 108
// touch 120
// touch 146
// touch 158
// touch 173
// touch 176
// touch 177
// touch 194
// touch 198
// touch 208
// touch 252
// touch 259
// touch 262
// touch 277
// touch 307
// touch 310
