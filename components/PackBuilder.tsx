import React, { useState, useMemo } from 'react';
import { Search, Package, Sparkles, Filter, X } from 'lucide-react';
import { Coin, Chain, Pack } from '../types';
import { MOCK_COINS } from '../constants';
import { CoinCard } from './CoinCard';
import { generatePackLore } from '../services/geminiService';

interface PackBuilderProps {
  onMint: (pack: Pack, cost: number) => void;
  balance: number;
}

export const PackBuilder: React.FC<PackBuilderProps> = ({ onMint, balance }) => {
  const [selectedCoins, setSelectedCoins] = useState<Coin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | Chain>('ALL');
  const [isMinting, setIsMinting] = useState(false);

  // Filter coins based on search and tab
  const filteredCoins = useMemo(() => {
    return MOCK_COINS.filter(coin => {
      const matchesSearch = coin.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            coin.ticker.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'ALL' || coin.chain === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const handleToggleCoin = (coin: Coin) => {
    if (selectedCoins.find(c => c.id === coin.id)) {
      setSelectedCoins(prev => prev.filter(c => c.id !== coin.id));
    } else {
      if (selectedCoins.length < 7) {
        setSelectedCoins(prev => [...prev, coin]);
      }
    }
  };

  const PACK_MINT_COST = 0.05;

  const handleMint = async () => {
    if (selectedCoins.length < 3 || selectedCoins.length > 7) return;
    if (balance < PACK_MINT_COST) {
        alert("Insufficient funds to mint pack!");
        return;
    }
    
    setIsMinting(true);
    
    // Simulate API delay for "Blockchain transaction" + Gemini call
    try {
      // Generate mock history
      const basePrice = PACK_MINT_COST;
      const history = [basePrice];
      let current = basePrice;
      // Generate 20 points of history
      for (let i = 0; i < 20; i++) {
          const change = (Math.random() - 0.5) * (basePrice * 0.1);
          current += change;
          if (current < 0.01) current = 0.01;
          history.push(current);
      }

      // Create partial pack
      const basePack: Pack = {
        id: crypto.randomUUID(),
        name: "Processing...",
        description: "Processing...",
        coins: selectedCoins,
        createdAt: new Date().toISOString(),
        owner: '0x71...3A9f', // Mock wallet
        priceHistory: history,
        currentPrice: current
      };

      // Call Gemini for lore
      const lore = await generatePackLore(selectedCoins, basePack.owner);
      
      const finalPack: Pack = {
        ...basePack,
        name: lore.name,
        description: lore.description,
        lore: `Pack forged with ${selectedCoins.filter(c => c.chain === Chain.SOLANA).length} Solana shards and ${selectedCoins.filter(c => c.chain === Chain.ZORA).length} Zora essence.`
      };

      onMint(finalPack, PACK_MINT_COST);
    } catch (e) {
      console.error(e);
      setIsMinting(false);
    }
  };

  const isValidPack = selectedCoins.length >= 3 && selectedCoins.length <= 7;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Coin Browser */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Search className="w-6 h-6 text-gray-400" />
              Discover Assets
            </h2>
            
            <div className="flex gap-2 bg-gray-900 p-1 rounded-lg border border-gray-800">
              <button 
                onClick={() => setActiveTab('ALL')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'ALL' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab(Chain.ZORA)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === Chain.ZORA ? 'bg-blue-900/40 text-blue-400 shadow border border-blue-500/20' : 'text-gray-400 hover:text-blue-300'}`}
              >
                Zora
              </button>
              <button 
                onClick={() => setActiveTab(Chain.SOLANA)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === Chain.SOLANA ? 'bg-green-900/40 text-green-400 shadow border border-green-500/20' : 'text-gray-400 hover:text-green-300'}`}
              >
                Solana
              </button>
            </div>
          </div>

          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by name or ticker..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-3 px-10 text-white focus:outline-none focus:border-purple-500 transition-colors"
            />
            <Filter className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 max-h-[60vh] overflow-y-auto pr-2">
            {filteredCoins.map(coin => (
              <CoinCard 
                key={coin.id} 
                coin={coin} 
                isSelected={!!selectedCoins.find(c => c.id === coin.id)}
                onToggle={handleToggleCoin}
                disabled={selectedCoins.length >= 7 && !selectedCoins.find(c => c.id === coin.id)}
              />
            ))}
            {filteredCoins.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                No coins found matching your criteria.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Pack Status */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="glass-panel sticky top-6 rounded-3xl p-6 border-t border-purple-500/20 flex flex-col h-[calc(100vh-100px)] lg:h-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-400" />
                Your Pack
              </h3>
              <span className={`text-sm font-mono px-2 py-1 rounded ${
                selectedCoins.length >= 3 && selectedCoins.length <= 7 
                  ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                  : 'bg-red-900/30 text-red-400 border border-red-500/30'
              }`}>
                {selectedCoins.length} / 7 items
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 mb-6 pr-1">
              {selectedCoins.length === 0 ? (
                <div className="h-40 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-700 rounded-xl">
                  <Package className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Select 3-7 coins to begin</p>
                </div>
              ) : (
                selectedCoins.map(coin => (
                  <div key={coin.id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg group hover:bg-gray-800 transition-colors">
                    <div className="flex items-center gap-3">
                      <img src={coin.imageUrl} alt={coin.ticker} className="w-8 h-8 rounded bg-gray-700" />
                      <div>
                        <p className="font-bold text-sm">{coin.ticker}</p>
                        <p className="text-[10px] text-gray-400 uppercase">{coin.chain}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleToggleCoin(coin)}
                      className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-all"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-auto space-y-4">
              <div className="p-4 bg-gray-900/50 rounded-xl space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Pack Base Fee</span>
                  <span>{PACK_MINT_COST} ETH</span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Curator Fee ($THEWCLUBBIGGS)</span>
                  <span className="line-through text-gray-600">500</span> <span className="text-purple-400">PAID</span>
                </div>
                <div className="h-px bg-gray-700 my-2"></div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{PACK_MINT_COST} ETH</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Balance</span>
                    <span>{balance.toFixed(4)} ETH</span>
                </div>
              </div>

              <button
                onClick={handleMint}
                disabled={!isValidPack || isMinting || balance < PACK_MINT_COST}
                className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed
                  bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
              >
                {isMinting ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    AI Minting...
                  </>
                ) : (
                  <>
                    {balance < PACK_MINT_COST ? 'Insufficient Funds' : 'Mint Pack'}
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
              
              {!isValidPack && selectedCoins.length > 0 && (
                <p className="text-xs text-center text-red-400">
                  Must select between 3 and 7 coins.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
