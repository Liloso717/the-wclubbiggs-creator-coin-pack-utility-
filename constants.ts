import { Chain, Coin } from './types';

export const MOCK_COINS: Coin[] = [
  // Zora Coins
  {
    id: 'z1',
    name: 'Jacob.eth',
    ticker: '$JACOB',
    chain: Chain.ZORA,
    price: 0.45,
    imageUrl: 'https://picsum.photos/100/100?random=1',
    creator: 'Jacob'
  },
  {
    id: 'z2',
    name: 'Colors of Noise',
    ticker: '$NOISE',
    chain: Chain.ZORA,
    price: 0.12,
    imageUrl: 'https://picsum.photos/100/100?random=2',
    creator: 'Audiophile'
  },
  {
    id: 'z3',
    name: 'Opepen Edition',
    ticker: '$OPEP',
    chain: Chain.ZORA,
    price: 1.20,
    imageUrl: 'https://picsum.photos/100/100?random=3',
    creator: 'Jack Butcher'
  },
  {
    id: 'z4',
    name: 'Zorb Sphere',
    ticker: '$ZORB',
    chain: Chain.ZORA,
    price: 0.05,
    imageUrl: 'https://picsum.photos/100/100?random=4',
    creator: 'Zora'
  },
  {
    id: 'z5',
    name: 'Digital Paint',
    ticker: '$PAINT',
    chain: Chain.ZORA,
    price: 0.88,
    imageUrl: 'https://picsum.photos/100/100?random=5',
    creator: 'ArtistX'
  },

  // Solana Coins
  {
    id: 's1',
    name: 'Mad Lads Coin',
    ticker: '$LAD',
    chain: Chain.SOLANA,
    price: 145.20,
    imageUrl: 'https://picsum.photos/100/100?random=6',
    creator: 'Armani'
  },
  {
    id: 's2',
    name: 'Bonk Origins',
    ticker: '$BONKO',
    chain: Chain.SOLANA,
    price: 0.0004,
    imageUrl: 'https://picsum.photos/100/100?random=7',
    creator: 'BonkDAO'
  },
  {
    id: 's3',
    name: 'Tensorian Shard',
    ticker: '$SHARD',
    chain: Chain.SOLANA,
    price: 22.50,
    imageUrl: 'https://picsum.photos/100/100?random=8',
    creator: 'Tensor'
  },
  {
    id: 's4',
    name: 'Claynosaurz dna',
    ticker: '$CLAY',
    chain: Chain.SOLANA,
    price: 55.00,
    imageUrl: 'https://picsum.photos/100/100?random=9',
    creator: 'Clayno'
  },
  {
    id: 's5',
    name: 'Smyths Gold',
    ticker: '$SMYTH',
    chain: Chain.SOLANA,
    price: 12.00,
    imageUrl: 'https://picsum.photos/100/100?random=10',
    creator: 'Blocksmith'
  },
  {
    id: 's6',
    name: 'Flash Drive',
    ticker: '$FLASH',
    chain: Chain.SOLANA,
    price: 1.00,
    imageUrl: 'https://picsum.photos/100/100?random=11',
    creator: 'Speedster'
  },
];
