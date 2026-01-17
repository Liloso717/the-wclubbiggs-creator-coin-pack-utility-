import React from 'react';
import { Plus, Check, ExternalLink } from 'lucide-react';
import { Coin, Chain } from '../types';

interface CoinCardProps {
  coin: Coin;
  isSelected: boolean;
  onToggle: (coin: Coin) => void;
  disabled?: boolean;
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin, isSelected, onToggle, disabled }) => {
  return (
    <div 
      onClick={() => !disabled && onToggle(coin)}
      className={`
        relative group cursor-pointer rounded-xl p-3 transition-all duration-300 border
        ${isSelected 
          ? 'bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' 
          : 'bg-gray-800/40 border-gray-700 hover:border-gray-500 hover:bg-gray-800/60'
        }
        ${disabled && !isSelected ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="relative">
          <img 
            src={coin.imageUrl} 
            alt={coin.name} 
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-black ${coin.chain === Chain.SOLANA ? 'bg-green-400 text-black' : 'bg-blue-400 text-black'}`}>
            {coin.chain === Chain.SOLANA ? 'S' : 'Z'}
          </div>
        </div>
        
        <div className={`
          w-6 h-6 rounded-full flex items-center justify-center transition-colors
          ${isSelected ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400 group-hover:bg-gray-600'}
        `}>
          {isSelected ? <Check size={14} /> : <Plus size={14} />}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-sm truncate">{coin.name}</h3>
        <p className="text-xs text-gray-400">{coin.ticker}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs font-mono text-gray-300">
            {coin.price} {coin.chain === Chain.SOLANA ? 'SOL' : 'ETH'}
          </span>
          <ExternalLink size={12} className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
};
