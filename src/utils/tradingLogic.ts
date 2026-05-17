export interface TradeSuggestion {
  id: string;
  name: string;
  symbol: string;
  type: string;
  currentPrice: number;
  entry: number;
  target: number;
  stopLoss: number;
  rsi: number;
  support: number;
  resistance: number;
  rr: number;
  score: number;
  volumeStatus: 'HIGH' | 'NORMAL' | 'LOW';
}

/**
 * Generates synthetic technical data for mock assets to simulate day trading scenarios.
 */
export const calculateTradeSuggestion = (asset: any): TradeSuggestion => {
  // Use price as a seed for stable "random" technicals
  const seed = asset.price;
  
  // 1. Synthetic Support & Resistance (1H Time Frame)
  const range = asset.price * 0.05; // 5% range
  const support = asset.price - (range * (Math.abs(Math.sin(seed)) * 0.5));
  const resistance = asset.price + (range * (Math.abs(Math.cos(seed)) * 0.5));

  // 2. Synthetic RSI (15m Time Frame)
  // Generates a value between 20 and 80
  const rsi = 20 + (Math.abs(Math.tan(seed)) % 1) * 60;

  // 3. Trade Setup (Actionable levels)
  const entry = asset.price;
  const target = resistance;
  const stopLoss = support - (asset.price * 0.01); // 1% below support

  // 4. Risk / Reward Calculation
  const risk = entry - stopLoss;
  const reward = target - entry;
  const rr = risk > 0 ? Number((reward / risk).toFixed(2)) : 0;

  // 5. Volume Status
  const volumeStatus = (Math.sin(seed * 2) > 0.5) ? 'HIGH' : 'NORMAL';

  // 6. Scoring Logic (0-100)
  let score = 0;

  // R/R Scoring (Max 35)
  if (rr >= 3) score += 35;
  else if (rr >= 2) score += 25;
  else if (rr >= 1.5) score += 15;

  // Support Proximity (Max 25)
  const distToSupport = (entry - support) / entry;
  if (distToSupport < 0.005) score += 25; // Very close to support
  else if (distToSupport < 0.015) score += 15;

  // RSI Scoring (Max 25)
  if (rsi <= 35) score += 25; // Oversold / Recovery
  else if (rsi <= 45) score += 15;
  else if (rsi >= 70) score -= 20; // Overbought penalty

  // Volume (Max 15)
  if (volumeStatus === 'HIGH') score += 15;

  return {
    id: asset.id,
    name: asset.name,
    symbol: asset.symbol,
    type: asset.type,
    currentPrice: asset.price,
    entry,
    target,
    stopLoss,
    rsi: Math.round(rsi),
    support: Number(support.toFixed(2)),
    resistance: Number(resistance.toFixed(2)),
    rr,
    score: Math.max(0, Math.min(100, score)),
    volumeStatus,
  };
};

export const getTopSuggestions = (assets: any[]): TradeSuggestion[] => {
  return assets
    .map(asset => calculateTradeSuggestion(asset))
    .sort((a, b) => b.score - a.score);
};
