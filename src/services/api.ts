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
const cache: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; 

export const fetchLiveMarketData = async (type: 'SET' | 'NASDAQ' | 'GOLD', forceRefresh = false) => {
  const now = Date.now();
  
  if (!forceRefresh && cache[type] && (now - cache[type].timestamp) < CACHE_DURATION) {
    return cache[type].data;
  }

  try {
    let symbols: string[] = [];
    if (type === 'SET') symbols = FULL_SCAN_LIST.THAI;
    else if (type === 'NASDAQ') symbols = FULL_SCAN_LIST.NASDAQ;
    else if (type === 'GOLD') symbols = FULL_SCAN_LIST.GOLD;
    
    // Scan top 15 to stay safe within URL limits
    const symbolsToScan = symbols.slice(0, 15).join(',');
    
    // DEBUG: Log the request
    console.log(`Fetching ${type} data for: ${symbolsToScan}`);

    const response = await yahooApi.get('/stock/get-price', {
      params: { symbol: symbolsToScan, region: 'US' }
    });

    // Check for different possible response structures
    const body = response.data?.body || response.data?.data || response.data;
    const items = Array.isArray(body) ? body : (body?.results || []);

    const marketData: any[] = [];
    
    if (items.length > 0) {
      items.forEach((item: any) => {
        marketData.push({
          id: (item.symbol || item.symbolName || '').toLowerCase().replace('.', '-'),
          name: item.shortName || item.longName || item.symbol || 'Unknown',
          symbol: (item.symbol || '').replace('.BK', ''),
          price: item.regularMarketPrice || item.price || 0,
          change: item.regularMarketChangePercent || item.changePercent || 0,
          volume: item.regularMarketVolume || item.volume || 0,
          type: type
        });
      });
    } else {
      console.warn(`No data items found in ${type} response`, response.data);
    }

    if (marketData.length > 0) {
      cache[type] = { data: marketData, timestamp: now };
      return marketData;
    }
    
    return cache[type]?.data || []; 
  } catch (error: any) {
    console.error(`Error scanning ${type} market:`, error.message);
    // If it's a 403/429, the key might be limited
    return cache[type]?.data || []; 
  }
};

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
