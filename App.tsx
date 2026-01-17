import React, { useState } from 'react';
import { AppState, Pack } from './types';
import { Gatekeeper } from './components/Gatekeeper';
import { PackBuilder } from './components/PackBuilder';
import { MintedPack } from './components/MintedPack';
import { LayoutGrid, Wallet, LogOut, ArrowRightCircle } from 'lucide-react';

const App = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOCKED);
  const [mintedPack, setMintedPack] = useState<Pack | null>(null);
  const [balance, setBalance] = useState<number>(5.0000); // Initial Mock Balance

  const handleUnlock = () => {
    setAppState(AppState.CURATING);
  };

  const handleMint = (pack: Pack, cost: number) => {
    setBalance(prev => prev - cost);
    setMintedPack(pack);
    setAppState(AppState.MINTED);
  };

  const handleReset = () => {
    setMintedPack(null);
    setAppState(AppState.CURATING);
  };

  const handleWithdraw = () => {
      const amount = balance;
      if (amount <= 0) {
          alert("No funds to withdraw.");
          return;
      }
      if (confirm(`Withdraw ${amount.toFixed(4)} ETH to connected wallet?`)) {
          alert(`Success! ${amount.toFixed(4)} ETH has been transferred to your wallet.`);
          setBalance(0);
      }
  };

  return (
    <div className="min-h-screen bg-[#0f0f13] text-white selection:bg-purple-500 selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-[#0f0f13]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => appState !== AppState.LOCKED && handleReset()}>
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <LayoutGrid size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">ThewClub<span className="text-purple-500">.packs</span></span>
            </div>
            
            <div className="flex items-center gap-4">
              {appState !== AppState.LOCKED && (
                <>
                    <div className="flex items-center gap-3 bg-gray-900/50 hover:bg-gray-900 border border-gray-800 rounded-full pl-4 pr-1 py-1 transition-colors">
                        <div className="flex flex-col leading-none">
                             <span className="text-[10px] text-gray-500 uppercase font-bold">Balance</span>
                             <span className="font-mono text-sm font-bold text-white">{balance.toFixed(4)} ETH</span>
                        </div>
                        <button 
                            onClick={handleWithdraw}
                            className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-1.5 rounded-full transition-colors"
                            title="Withdraw Funds"
                        >
                            <LogOut size={14} />
                        </button>
                    </div>

                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-900/20 text-purple-400 text-sm border border-purple-500/20 font-medium">
                        <Wallet size={14} />
                        <span>$THEWCLUBBIGGS Access</span>
                    </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
        
        {appState === AppState.LOCKED && (
          <Gatekeeper onUnlock={handleUnlock} />
        )}

        {appState === AppState.CURATING && (
          <PackBuilder onMint={handleMint} balance={balance} />
        )}

        {appState === AppState.MINTED && mintedPack && (
          <MintedPack 
            pack={mintedPack} 
            onReset={handleReset} 
            balance={balance}
            onUpdateBalance={setBalance}
          />
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-900 mt-auto py-8 text-center text-gray-600 text-sm relative z-10">
        <p>© 2024 ThewClub. All rights reserved.</p>
        <p className="mt-1 text-xs opacity-50">Powered by Zora & Solana • Generated with Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
