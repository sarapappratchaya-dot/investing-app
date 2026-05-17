import axios from 'axios';
import { FULL_SCAN_LIST } from './symbols';

const RAPIDAPI_KEY = '0f3a3a23e6msh0cc160b4b34d059p13693fjsneb8d2cf42ef8';
const RAPIDAPI_HOST = 'yahoo-finance-real-time1.p.rapidapi.com';

const yahooApi = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
  },
});

export const fetchLiveMarketData = async (type: 'SET' | 'NASDAQ' | 'GOLD') => {
  try {
    let symbols: string[] = [];
    if (type === 'SET') symbols = FULL_SCAN_LIST.THAI;
    else if (type === 'NASDAQ') symbols = FULL_SCAN_LIST.NASDAQ;
    else if (type === 'GOLD') symbols = FULL_SCAN_LIST.GOLD;
    
    const chunkSize = 10;
    const chunks = [];
    for (let i = 0; i < symbols.length; i += chunkSize) {
      chunks.push(symbols.slice(i, i + chunkSize));
    }

    // Scan a limited amount to stay within free tier
    const scanLimit = type === 'GOLD' ? 1 : 3;
    const scanChunks = chunks.slice(0, scanLimit); 
    
    const results = await Promise.all(scanChunks.map(chunk => 
      yahooApi.get('/stock/get-price', {
        params: { symbol: chunk.join(','), region: 'US' }
      })
    ));

    const marketData: any[] = [];
    results.forEach(response => {
      if (response.data && response.data.body) {
        response.data.body.forEach((item: any) => {
          marketData.push({
            id: item.symbol.toLowerCase().replace('.', '-'),
            name: item.shortName || item.symbol,
            symbol: item.symbol.replace('.BK', ''),
            price: item.regularMarketPrice || 0,
            change: item.regularMarketChangePercent || 0,
            volume: item.regularMarketVolume || 0,
            type: type
          });
        });
      }
    });

    return marketData;
  } catch (error) {
    console.error(`Error scanning ${type} market:`, error);
    return [];
  }
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
      volume: item.total_volume,
      type: 'CRYPTO',
      image: item.image,
    }));
  } catch (error) {
    console.error('Error fetching crypto:', error);
    return [];
  }
};
