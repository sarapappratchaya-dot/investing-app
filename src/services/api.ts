import axios from 'axios';

// Mock data for initial development
export const getMockData = () => {
  return [
    { id: '1', name: 'SET Index', symbol: 'SET', price: 1380.5, change: 1.2, type: 'THAI' },
    { id: '2', name: 'PTT PCL', symbol: 'PTT.BK', price: 34.25, change: -0.5, type: 'THAI' },
    { id: '3', name: 'Bitcoin', symbol: 'BTC', price: 65230.1, change: 2.5, type: 'CRYPTO' },
    { id: '4', name: 'Ethereum', symbol: 'ETH', price: 3450.2, change: 1.8, type: 'CRYPTO' },
    { id: '5', name: 'NASDAQ 100', symbol: 'NDX', price: 18230.5, change: 0.8, type: 'GLOBAL' },
    { id: '6', name: 'Gold', symbol: 'GC=F', price: 2350.4, change: 0.3, type: 'GLOBAL' },
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
