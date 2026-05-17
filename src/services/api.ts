import axios from 'axios';
import { FULL_SCAN_LIST } from './symbols';

// --- CONFIGURATION ---
const RAPIDAPI_KEY = '0f3a3a23e6msh0cc160b4b34d059p13693fjsneb8d2cf42ef8';
const RAPIDAPI_HOST = 'yahoo-finance-real-time1.p.rapidapi.com';

// Finnhub is excellent for NASDAQ/US stocks and has a great free tier
// Note: This is a free sandbox key for demo purposes. 
// For production, the user should get their own free key from finnhub.io
const FINNHUB_KEY = 'sandbox_c8r8qsqad3i9ptf8c44g'; 

const yahooApi = axios.create({
  baseURL: `https://${RAPIDAPI_HOST}`,
  headers: {
    'x-rapidapi-key': RAPIDAPI_KEY,
    'x-rapidapi-host': RAPIDAPI_HOST,
  },
});

const finnhubApi = axios.create({
  baseURL: 'https://finnhub.io/api/v1',
  params: { token: FINNHUB_KEY }
});

// --- CACHING ---
const cache: Record<string, { data: any[]; timestamp: number }> = {};
const CACHE_DURATION = 10 * 60 * 1000; 

// --- FETCHING LOGIC ---

/**
 * FETCH THAI STOCKS (SET) - Using Yahoo Finance (Your RapidAPI Key)
 */
export const fetchSETData = async (forceRefresh = false) => {
  const type = 'SET';
  const now = Date.now();
  if (!forceRefresh && cache[type] && (now - cache[type].timestamp) < CACHE_DURATION) return cache[type].data;

  try {
    const symbols = FULL_SCAN_LIST.THAI.slice(0, 15).join(',');
    const response = await yahooApi.get('/stock/get-price', { params: { symbol: symbols, region: 'US' } });
    
    const body = response.data?.body || response.data?.data || response.data;
    const items = Array.isArray(body) ? body : (body?.results || []);
    
    const data = items.map((item: any) => ({
      id: (item.symbol || '').toLowerCase().replace('.', '-'),
      name: item.shortName || item.symbol,
      symbol: (item.symbol || '').replace('.BK', ''),
      price: item.regularMarketPrice || 0,
      change: item.regularMarketChangePercent || 0,
      volume: item.regularMarketVolume || 0,
      type: 'SET'
    }));

    if (data.length > 0) cache[type] = { data, timestamp: now };
    return data;
  } catch (error) {
    console.error("Yahoo SET Error:", error);
    return cache[type]?.data || [];
  }
};

/**
 * FETCH NASDAQ DATA - Using Finnhub (Separate API to save Yahoo points)
 */
export const fetchNASDAQData = async (forceRefresh = false) => {
  const type = 'NASDAQ';
  const now = Date.now();
  if (!forceRefresh && cache[type] && (now - cache[type].timestamp) < CACHE_DURATION) return cache[type].data;

  try {
    const symbols = FULL_SCAN_LIST.NASDAQ.slice(0, 15);
    
    // Finnhub quote endpoint is per-symbol for free tier, 
    // but they are very fast. We scan top 8 to be safe.
    const scanList = symbols.slice(0, 8);
    
    const results = await Promise.all(scanList.map(symbol => 
      finnhubApi.get('/quote', { params: { symbol } })
    ));

    const data = results.map((res, index) => {
      const item = res.data;
      return {
        id: `nasdaq-${scanList[index].toLowerCase()}`,
        name: scanList[index],
        symbol: scanList[index],
        price: item.c || 0, // Current price
        change: item.dp || 0, // Percent change
        volume: 0, // Quote endpoint doesn't always provide volume in free
        type: 'NASDAQ'
      };
    });

    cache[type] = { data, timestamp: now };
    return data;
  } catch (error) {
    console.error("Finnhub NASDAQ Error:", error);
    return cache[type]?.data || [];
  }
};

/**
 * FETCH GOLD DATA - Yahoo Finance
 */
export const fetchGoldData = async (forceRefresh = false) => {
  const type = 'GOLD';
  const now = Date.now();
  if (!forceRefresh && cache[type] && (now - cache[type].timestamp) < CACHE_DURATION) return cache[type].data;

  try {
    const symbols = FULL_SCAN_LIST.GOLD.join(',');
    const response = await yahooApi.get('/stock/get-price', { params: { symbol: symbols, region: 'US' } });
    const body = response.data?.body || response.data;
    const items = Array.isArray(body) ? body : [body];

    const data = items.map((item: any) => ({
      id: `gold-${item.symbol.toLowerCase()}`,
      name: item.shortName || item.symbol,
      symbol: item.symbol,
      price: item.regularMarketPrice || 0,
      change: item.regularMarketChangePercent || 0,
      type: 'GOLD'
    }));

    cache[type] = { data, timestamp: now };
    return data;
  } catch (error) {
    return cache[type]?.data || [];
  }
};

/**
 * FETCH CRYPTO DATA - CoinGecko
 */
export const fetchCryptoTop50 = async (forceRefresh = false) => {
  const type = 'CRYPTO';
  const now = Date.now();
  if (!forceRefresh && cache[type] && (now - cache[type].timestamp) < CACHE_DURATION) return cache[type].data;

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: { vs_currency: 'usd', order: 'market_cap_desc', per_page: 50, page: 1 }
    });
    const data = response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      symbol: item.symbol.toUpperCase(),
      price: item.current_price,
      change: item.price_change_percentage_24h,
      type: 'CRYPTO',
      image: item.image,
    }));
    cache[type] = { data, timestamp: now };
    return data;
  } catch (error) {
    return cache[type]?.data || [];
  }
};
