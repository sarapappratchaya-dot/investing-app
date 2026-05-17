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

// --- API OPTIMIZATION: CACHING SYSTEM ---
// We store data in memory to avoid redundant calls within the same session.
const cache: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; // 10 Minutes (Reduces calls significantly)

export const fetchLiveMarketData = async (type: 'SET' | 'NASDAQ' | 'GOLD', forceRefresh = false) => {
  const now = Date.now();
  
  // 1. Check Cache first
  if (!forceRefresh && cache[type] && (now - cache[type].timestamp) < CACHE_DURATION) {
    console.log(`Using cached data for ${type}`);
    return cache[type].data;
  }

  try {
    let symbols: string[] = [];
    if (type === 'SET') symbols = FULL_SCAN_LIST.THAI;
    else if (type === 'NASDAQ') symbols = FULL_SCAN_LIST.NASDAQ;
    else if (type === 'GOLD') symbols = FULL_SCAN_LIST.GOLD;
    
    // 2. Optimization: Single call for multiple symbols
    // We only scan the top 20 symbols of each category to save API points.
    const symbolsToScan = symbols.slice(0, 20).join(',');
    
    const response = await yahooApi.get('/stock/get-price', {
      params: { symbol: symbolsToScan, region: 'US' }
    });

    const marketData: any[] = [];
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

    // 3. Update Cache
    cache[type] = { data: marketData, timestamp: now };
    return marketData;
  } catch (error) {
    console.error(`Error scanning ${type} market:`, error);
    return cache[type]?.data || []; // Return old cache if error
  }
};

// Crypto API is free/unlimited, so no strict cache needed, but good for speed
export const fetchCryptoTop50 = async (forceRefresh = false) => {
  const now = Date.now();
  if (!forceRefresh && cache['CRYPTO'] && (now - cache['CRYPTO'].timestamp) < 5 * 60 * 1000) {
    return cache['CRYPTO'].data;
  }

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
    const data = response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      price: item.current_price,
      change: item.price_change_percentage_24h,
      volume: item.total_volume,
      type: 'CRYPTO',
      image: item.image,
    }));
    cache['CRYPTO'] = { data, timestamp: now };
    return data;
  } catch (error) {
    console.error('Error fetching crypto:', error);
    return cache['CRYPTO']?.data || [];
  }
};
