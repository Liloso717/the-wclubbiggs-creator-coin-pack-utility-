import React, { useState, useEffect } from 'react';
import { Pack, Chain } from '../types';
import { Share2, ArrowLeft, TrendingUp, TrendingDown, DollarSign, Wallet, Package, X, Copy, Users, Layers, Droplets, ArrowUpCircle, ArrowDownCircle, Info, Calendar, Clock, UserCircle } from 'lucide-react';
import { Chart } from './Chart';

interface MintedPackProps {
  pack: Pack;
  onReset: () => void;
  balance: number;
  onUpdateBalance: (newBalance: number) => void;
}

export const MintedPack: React.FC<MintedPackProps> = ({ pack, onReset, balance, onUpdateBalance }) => {
  const [currentPrice, setCurrentPrice] = useState(pack.currentPrice);
  const [history, setHistory] = useState<number[]>(pack.priceHistory);
  const [holdings, setHoldings] = useState(1); // Start with 1 pack after minting
  const [stakedBalance, setStakedBalance] = useState(0);
  const [simulationActive, setSimulationActive] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [holdTime, setHoldTime] = useState<string>('');

  // Mock Data constants
  const ETH_PRICE_USD = 3200; 
  const TOTAL_SUPPLY = 1000;
  const OWNERS_COUNT = 142;
  const STAKING_APY = 12.5;

  // Simulate live market movements
  useEffect(() => {
    if (!simulationActive) return;

    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.48) * (prev * 0.05); // Slight upward bias
        const newPrice = Math.max(0.001, prev + change);
        
        setHistory(h => {
          const newHistory = [...h, newPrice];
          if (newHistory.length > 50) newHistory.shift(); // Keep last 50 points
          return newHistory;
        });
        return newPrice;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [simulationActive]);

  // Calculate Hold Time
  useEffect(() => {
    const updateHoldTime = () => {
        const start = new Date(pack.createdAt).getTime();
        const now = Date.now();
        const diff = Math.max(0, now - start);
        
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) setHoldTime(`${days}d ${hours % 24}h`);
        else if (hours > 0) setHoldTime(`${hours}h ${minutes % 60}m`);
        else setHoldTime(`${minutes}m ${seconds % 60}s`);
    };
    
    updateHoldTime();
    const interval = setInterval(updateHoldTime, 1000);
    return () => clearInterval(interval);
  }, [pack.createdAt]);

  const handleBuy = () => {
    if (balance >= currentPrice) {
      onUpdateBalance(balance - currentPrice);
      setHoldings(h => h + 1);
    } else {
        alert("Insufficient funds!");
    }
  };

  const handleSell = () => {
    if (holdings > 0) {
      onUpdateBalance(balance + currentPrice);
      setHoldings(h => h - 1);
    }
  };

  const handleStake = () => {
    if (holdings > 0) {
        setHoldings(prev => prev - 1);
        setStakedBalance(prev => prev + 1);
    }
  };

  const handleUnstake = () => {
    if (stakedBalance > 0) {
        setStakedBalance(prev => prev - 1);
        setHoldings(prev => prev + 1);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`https://thewclub.app/pack/${pack.id}`);
    alert("Link copied to clipboard!");
  };

  const priceChange = history.length > 1 
    ? ((currentPrice - history[history.length - 2]) / history[history.length - 2]) * 100 
    : 0;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in space-y-6 relative">
      
      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel p-6 rounded-2xl max-w-md w-full relative border border-purple-500/20 shadow-2xl bg-[#0f0f13]">
                <button 
                    onClick={() => setIsShareModalOpen(false)} 
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-900/30 rounded-full text-purple-400">
                        <Share2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Share Pack</h3>
                        <p className="text-xs text-gray-400">Show off your curation.</p>
                    </div>
                </div>
                
                <p className="text-gray-300 mb-6 text-sm">
                    Share <span className="text-white font-bold">{pack.name}</span> with your network.
                </p>
                
                <div className="bg-gray-900 p-3 rounded-lg flex items-center justify-between border border-gray-800 mb-6">
                    <code className="text-xs text-purple-300 truncate mr-2 font-mono">
                        https://thewclub.app/pack/{pack.id.slice(0,8)}
                    </code>
                    <button 
                        onClick={copyToClipboard}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Copy Link"
                    >
                        <Copy size={16} />
                    </button>
                </div>
                
                <button 
                    onClick={() => setIsShareModalOpen(false)}
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors"
                >
                    Done
                </button>
            </div>
        </div>
      )}

      <div className="flex items-center justify-between">
         <button onClick={onReset} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
            <ArrowLeft size={16} /> Back to Curator
          </button>
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400 text-sm">Balance:</span>
                <span className="font-mono font-bold">{balance.toFixed(4)} ETH</span>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-3xl border-t border-purple-500/20">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-bold">{pack.name}</h1>
                            <span className="bg-purple-900/40 text-purple-300 text-xs px-2 py-0.5 rounded border border-purple-500/30">PACK</span>
                        </div>
                        <div className="flex items-baseline gap-4">
                            <span className="text-4xl font-mono font-bold tracking-tight">{currentPrice.toFixed(4)} ETH</span>
                            <span className={`flex items-center text-sm font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {priceChange >= 0 ? <TrendingUp size={16} className="mr-1"/> : <TrendingDown size={16} className="mr-1"/>}
                                {Math.abs(priceChange).toFixed(2)}%
                            </span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsShareModalOpen(true)}
                        className="p-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                    >
                        <Share2 size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="h-[300px] w-full bg-gray-900/20 rounded-xl border border-gray-800/50 p-4 relative overflow-hidden">
                    <Chart data={history} color={priceChange >= 0 ? '#4ade80' : '#f87171'} />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <button 
                        onClick={handleSell}
                        disabled={holdings <= 0}
                        className="py-4 rounded-xl bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Sell Pack
                    </button>
                    <button 
                        onClick={handleBuy}
                        disabled={balance < currentPrice}
                        className="py-4 rounded-xl bg-green-500/10 text-green-500 border border-green-500/50 hover:bg-green-500 hover:text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Buy Pack
                    </button>
                </div>
            </div>

            {/* Pack Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="glass-panel p-4 rounded-xl flex flex-col justify-center border-l-4 border-l-purple-500">
                    <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs uppercase font-bold tracking-wider">
                        <Layers size={14} /> Total Supply
                    </div>
                    <span className="font-mono text-xl font-bold text-white">{TOTAL_SUPPLY.toLocaleString()}</span>
                 </div>
                 <div className="glass-panel p-4 rounded-xl flex flex-col justify-center border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs uppercase font-bold tracking-wider">
                        <Users size={14} /> Owners
                    </div>
                    <span className="font-mono text-xl font-bold text-white">{OWNERS_COUNT.toLocaleString()}</span>
                 </div>
                 <div className="glass-panel p-4 rounded-xl flex flex-col justify-center border-l-4 border-l-green-500">
                    <div className="flex items-center gap-2 mb-1 text-gray-400 text-xs uppercase font-bold tracking-wider">
                        <DollarSign size={14} /> USD Value
                    </div>
                    <span className="font-mono text-xl font-bold text-green-400">
                        ${(currentPrice * ETH_PRICE_USD).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                 </div>
            </div>

            {/* Holdings & Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Your Holdings</h3>
                    <div className="flex items-center gap-3">
                         <div className="p-3 rounded-full bg-purple-900/30 text-purple-400">
                             <Package size={24} />
                         </div>
                         <div>
                             <p className="text-2xl font-bold">{holdings} <span className="text-sm text-gray-500 font-normal">PACKS</span></p>
                             <p className="text-sm text-gray-400">≈ {(holdings * currentPrice).toFixed(4)} ETH</p>
                         </div>
                    </div>
                 </div>
                 <div className="glass-panel p-5 rounded-2xl">
                    <h3 className="text-gray-400 text-sm font-bold uppercase mb-2">Pack Volume</h3>
                    <div className="flex items-center gap-3">
                         <div className="p-3 rounded-full bg-blue-900/30 text-blue-400">
                             <DollarSign size={24} />
                         </div>
                         <div>
                             <p className="text-2xl font-bold">{(currentPrice * 1245).toFixed(2)} <span className="text-sm text-gray-500 font-normal">ETH</span></p>
                             <p className="text-sm text-gray-400">24h Trading Volume</p>
                         </div>
                    </div>
                 </div>
            </div>

            {/* Liquid Staking Section */}
            <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 bg-blue-900/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Droplets size={120} />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                            <Droplets size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">Liquid Staking</h3>
                            <p className="text-sm text-blue-300">Earn rewards while holding</p>
                        </div>
                        <div className="ml-auto flex flex-col items-end">
                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Current APY</span>
                            <span className="text-2xl font-bold text-green-400">{STAKING_APY}%</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-6">
                        <div>
                             <p className="text-gray-400 text-sm mb-1">Staked Balance</p>
                             <p className="text-2xl font-mono font-bold">{stakedBalance} <span className="text-sm text-gray-500">PACKS</span></p>
                        </div>
                        <div>
                             <p className="text-gray-400 text-sm mb-1">Est. Daily Rewards</p>
                             <p className="text-2xl font-mono font-bold text-green-400">
                                {(stakedBalance * currentPrice * (STAKING_APY / 100 / 365)).toFixed(6)} <span className="text-sm text-gray-500">ETH</span>
                             </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={handleStake}
                            disabled={holdings <= 0}
                            className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ArrowDownCircle size={18} /> Stake Pack
                        </button>
                         <button 
                            onClick={handleUnstake}
                            disabled={stakedBalance <= 0}
                            className="flex-1 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <ArrowUpCircle size={18} /> Unstake
                        </button>
                    </div>
                </div>
            </div>

            {/* NEW: Pack Provenance & Details Section */}
            <div className="glass-panel p-6 rounded-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                    <Info className="w-5 h-5 text-purple-400" />
                    Pack Provenance & Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* Creator Info */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UserCircle className="text-gray-400" size={18} />
                                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Creator</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-[10px] text-white">
                                    {pack.owner.substring(2,4)}
                                </div>
                                <span className="font-mono font-bold text-sm">{pack.owner}</span>
                            </div>
                        </div>

                        {/* Mint Date */}
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Calendar className="text-gray-400" size={18} />
                                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Mint Date</span>
                            </div>
                             <div className="text-right">
                                <p className="font-mono font-bold text-sm">
                                    {new Date(pack.createdAt).toLocaleDateString()}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                    {new Date(pack.createdAt).toLocaleTimeString()}
                                </p>
                             </div>
                        </div>

                        {/* Hold Time */}
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <Clock className="text-gray-400" size={18} />
                                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Hold Time</span>
                            </div>
                            <span className="font-mono font-bold text-sm text-green-400">
                                {holdTime}
                            </span>
                        </div>

                         {/* Pack Value */}
                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-2">
                                <DollarSign className="text-gray-400" size={18} />
                                <span className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total Value</span>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-sm">{currentPrice.toFixed(4)} ETH</p>
                                <p className="text-[10px] text-gray-500">(${ (currentPrice * ETH_PRICE_USD).toFixed(2) })</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-l border-gray-800 md:pl-6">
                        <span className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-3 block">Included Assets ({pack.coins.length})</span>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {pack.coins.map(coin => (
                                <div key={coin.id} className="relative group aspect-square cursor-help">
                                    <img 
                                        src={coin.imageUrl} 
                                        alt={coin.name} 
                                        className="w-full h-full rounded-lg object-cover bg-gray-800 border border-gray-700 group-hover:border-purple-500 transition-colors" 
                                    />
                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-1">
                                        <span className="text-[10px] text-center font-bold break-words leading-tight text-white">{coin.ticker}</span>
                                        <span className={`text-[8px] px-1 rounded mt-1 ${coin.chain === Chain.SOLANA ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>{coin.chain}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl h-full flex flex-col">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    Pack Composition
                </h3>
                
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {pack.coins.map((coin) => (
                         <div key={coin.id} className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-xl border border-gray-800">
                            <img src={coin.imageUrl} className="w-10 h-10 rounded-lg object-cover bg-gray-700" alt={coin.name} />
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm truncate">{coin.name}</p>
                                <div className="flex items-center gap-2">
                                     <span className={`text-[10px] px-1.5 py-0.5 rounded ${coin.chain === Chain.SOLANA ? 'bg-green-900/30 text-green-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                         {coin.chain}
                                     </span>
                                     <span className="text-xs text-gray-500">{coin.ticker}</span>
                                </div>
                            </div>
                         </div>
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-800">
                     <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">AI Analysis</h4>
                     <p className="text-sm text-gray-400 leading-relaxed italic">
                        "{pack.lore}"
                     </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};