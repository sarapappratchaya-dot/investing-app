import axios from 'axios';

// Mock data for initial development
export const getMockData = () => {
  return [
    { id: 'set-index', name: 'SET Index', symbol: 'SET', price: 1380.5, change: 1.2, type: 'THAI' },
    { id: 'ptt', name: 'PTT PCL', symbol: 'PTT', price: 34.25, change: -0.5, type: 'THAI' },
    { id: 'cpall', name: 'CP ALL PCL', symbol: 'CPALL', price: 58.50, change: 0.75, type: 'THAI' },
    { id: 'aot', name: 'Airports of Thailand', symbol: 'AOT', price: 65.25, change: -1.2, type: 'THAI' },
    { id: 'scb', name: 'SCB X PCL', symbol: 'SCB', price: 112.50, change: 0.5, type: 'THAI' },
    { id: 'kbank', name: 'Kasikornbank PCL', symbol: 'KBANK', price: 128.50, change: 1.1, type: 'THAI' },
    { id: 'advanc', name: 'Advanced Info Service', symbol: 'ADVANC', price: 210.0, change: 0.2, type: 'THAI' },
    { id: 'gulf', name: 'Gulf Energy Development', symbol: 'GULF', price: 42.75, change: -0.8, type: 'THAI' },
    { id: 'bdms', name: 'Bangkok Dusit Medical', symbol: 'BDMS', price: 28.50, change: 0.4, type: 'THAI' },
    { id: 'delta', name: 'Delta Electronics', symbol: 'DELTA', price: 72.50, change: 2.5, type: 'THAI' },
    { id: 'bbl', name: 'Bangkok Bank PCL', symbol: 'BBL', price: 142.0, change: -0.3, type: 'THAI' },
    { id: 'ktb', name: 'Krung Thai Bank PCL', symbol: 'KTB', price: 16.80, change: 0.6, type: 'THAI' },
    { id: 'cpn', name: 'Central Pattana PCL', symbol: 'CPN', price: 64.50, change: 0.0, type: 'THAI' },
    { id: 'true', name: 'True Corporation PCL', symbol: 'TRUE', price: 8.45, change: 1.2, type: 'THAI' },
    { id: 'mint', name: 'Minor International', symbol: 'MINT', price: 30.25, change: -1.5, type: 'THAI' },
    { id: 'nasdaq-index', name: 'NASDAQ 100', symbol: 'NDX', price: 18230.5, change: 0.8, type: 'GLOBAL' },
    { id: 'aapl', name: 'Apple Inc.', symbol: 'AAPL', price: 189.45, change: 0.45, type: 'GLOBAL' },
    { id: 'msft', name: 'Microsoft Corp.', symbol: 'MSFT', price: 415.20, change: -0.12, type: 'GLOBAL' },
    { id: 'amzn', name: 'Amazon.com Inc.', symbol: 'AMZN', price: 178.35, change: 1.25, type: 'GLOBAL' },
    { id: 'googl', name: 'Alphabet Inc.', symbol: 'GOOGL', price: 154.85, change: 0.85, type: 'GLOBAL' },
    { id: 'nvda', name: 'NVIDIA Corp.', symbol: 'NVDA', price: 875.40, change: 3.20, type: 'GLOBAL' },
    { id: 'tsla', name: 'Tesla Inc.', symbol: 'TSLA', price: 175.25, change: -2.40, type: 'GLOBAL' },
    { id: 'meta', name: 'Meta Platforms Inc.', symbol: 'META', price: 505.30, change: 1.10, type: 'GLOBAL' },
    { id: 'nflx', name: 'Netflix Inc.', symbol: 'NFLX', price: 620.15, change: 0.65, type: 'GLOBAL' },
    { id: 'avgo', name: 'Broadcom Inc.', symbol: 'AVGO', price: 1350.50, change: 2.15, type: 'GLOBAL' },
    { id: 'cost', name: 'Costco Wholesale', symbol: 'COST', price: 735.20, change: 0.35, type: 'GLOBAL' },
    { id: 'gold', name: 'Gold', symbol: 'GC=F', price: 2350.4, change: 0.3, type: 'GLOBAL' },
  ];
};

export const fetchCryptoTop50 = async () => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 50,
        page: 1,
        sparkline: false,
      },
    });
    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      price: item.current_price,
      change: item.price_change_percentage_24h,
      type: 'CRYPTO',
      image: item.image,
    }));
  } catch (error) {
    console.error('Error fetching crypto:', error);
    return [];
  }
};
