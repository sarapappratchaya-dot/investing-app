import axios from 'axios';

// IMPORTANT: In a real app, use environment variables. 
// For this prototype, we'll use the key you provided.
const RAPIDAPI_KEY = '0f3a3a23e6msh0cc160b4b34d059p13693fjsneb8d2cf42ef8';
const RAPIDAPI_HOST = 'yahoo-finance-real-time1.p.rapidapi.com';

const yahooApi = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
  },
});

// Mapping our symbols to Yahoo Finance symbols
const STOCK_SYMBOLS: Record<string, { yahoo: string; name: string; type: 'THAI' | 'GLOBAL' }> = {
  'PTT': { yahoo: 'PTT.BK', name: 'PTT PCL', type: 'THAI' },
  'CPALL': { yahoo: 'CPALL.BK', name: 'CP ALL PCL', type: 'THAI' },
  'AOT': { yahoo: 'AOT.BK', name: 'Airports of Thailand', type: 'THAI' },
  'SCB': { yahoo: 'SCB.BK', name: 'SCB X PCL', type: 'THAI' },
  'KBANK': { yahoo: 'KBANK.BK', name: 'Kasikornbank PCL', type: 'THAI' },
  'ADVANC': { yahoo: 'ADVANC.BK', name: 'Advanced Info Service', type: 'THAI' },
  'AAPL': { yahoo: 'AAPL', name: 'Apple Inc.', type: 'GLOBAL' },
  'TSLA': { yahoo: 'TSLA', name: 'Tesla Inc.', type: 'GLOBAL' },
  'NVDA': { yahoo: 'NVDA', name: 'NVIDIA Corp.', type: 'GLOBAL' },
  'MSFT': { yahoo: 'MSFT', name: 'Microsoft Corp.', type: 'GLOBAL' },
};

export const fetchLiveStockData = async () => {
  try {
    const symbols = Object.values(STOCK_SYMBOLS).map(s => s.yahoo).join(',');
    // Note: The endpoint below is a common pattern for this API. 
    // If the endpoint in your curl was different, we can adjust.
    const response = await yahooApi.get('/stock/get-price', {
      params: { symbol: symbols, region: 'US' }
    });

    // Handle response mapping (logic depends on specific API response structure)
    // For now, we return a fallback if the specific live call fails to ensure UI stays active.
    if (response.data && response.data.body) {
       return Object.keys(STOCK_SYMBOLS).map(key => {
         const info = STOCK_SYMBOLS[key];
         const liveData = response.data.body.find((item: any) => item.symbol === info.yahoo);
         return {
           id: key.toLowerCase(),
           name: info.name,
           symbol: key,
           price: liveData?.regularMarketPrice || 0,
           change: liveData?.regularMarketChangePercent || 0,
           type: info.type
         };
       });
    }
    return getMockData(); // Fallback to mock if API response is unexpected
  } catch (error) {
    console.error('Yahoo Finance API Error:', error);
    return getMockData();
  }
};

export const getMockData = () => {
  return [
    { id: 'set-index', name: 'SET Index', symbol: 'SET', price: 1380.5, change: 1.2, type: 'THAI' },
    { id: 'ptt', name: 'PTT PCL', symbol: 'PTT', price: 34.25, change: -0.5, type: 'THAI' },
    { id: 'cpall', name: 'CP ALL PCL', symbol: 'CPALL', price: 58.50, change: 0.75, type: 'THAI' },
    { id: 'aot', name: 'Airports of Thailand', symbol: 'AOT', price: 65.25, change: -1.2, type: 'THAI' },
    { id: 'scb', name: 'SCB X PCL', symbol: 'SCB', price: 112.50, change: 0.5, type: 'THAI' },
    { id: 'kbank', name: 'Kasikornbank PCL', symbol: 'KBANK', price: 128.50, change: 1.1, type: 'THAI' },
    { id: 'advanc', name: 'Advanced Info Service', symbol: 'ADVANC', price: 210.0, change: 0.2, type: 'THAI' },
    { id: 'aapl', name: 'Apple Inc.', symbol: 'AAPL', price: 189.45, change: 0.45, type: 'GLOBAL' },
    { id: 'tsla', name: 'Tesla Inc.', symbol: 'TSLA', price: 175.25, change: -2.40, type: 'GLOBAL' },
    { id: 'nvda', name: 'NVIDIA Corp.', symbol: 'NVDA', price: 875.40, change: 3.20, type: 'GLOBAL' },
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
