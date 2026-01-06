
export interface MarketAnalysis {
  pair: string;
  confluenceScore: number;
  signal: 'TAKE TRADE' | 'NOT TAKE TRADE';
  direction: 'BUY' | 'SELL' | 'NEUTRAL';
  entry: string;
  stopLoss: string;
  takeProfit: string;
  reasoning: string[];
  sources: { title: string; uri: string }[];
}

export interface ScannerState {
  isScanning: boolean;
  results: MarketAnalysis[];
  lastUpdated: string | null;
  error: string | null;
}

export const MAJOR_PAIRS = [
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "AUD/USD", "USD/CAD", "NZD/USD",
  "XAU/USD", "BTC/USD", "ETH/USD"
];
