
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeMarketPair } from './services/geminiService';
import { MarketAnalysis, ScannerState, MAJOR_PAIRS } from './types';
import AnalysisCard from './components/AnalysisCard';

const App: React.FC = () => {
  const [state, setState] = useState<ScannerState>({
    isScanning: false,
    results: [],
    lastUpdated: null,
    error: null,
  });

  const [selectedPairs, setSelectedPairs] = useState<string[]>(["EUR/USD", "XAU/USD", "BTC/USD"]);
  const [activeTab, setActiveTab] = useState<'all' | 'signals'>('all');

  const runScanner = useCallback(async () => {
    setState(prev => ({ ...prev, isScanning: true, error: null }));
    
    try {
      const scanResults: MarketAnalysis[] = [];
      
      // Scanning in parallel
      const analysisPromises = selectedPairs.map(pair => analyzeMarketPair(pair));
      const results = await Promise.all(analysisPromises);
      
      setState({
        isScanning: false,
        results,
        lastUpdated: new Date().toLocaleTimeString(),
        error: null
      });
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isScanning: false,
        error: "Kuna tatizo la kuunganisha data. Tafadhali jaribu tena baadae."
      }));
    }
  }, [selectedPairs]);

  const togglePairSelection = (pair: string) => {
    setSelectedPairs(prev => 
      prev.includes(pair) ? prev.filter(p => p !== pair) : [...prev, pair]
    );
  };

  const filteredResults = activeTab === 'all' 
    ? state.results 
    : state.results.filter(r => r.signal === 'TAKE TRADE');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation / Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">CONFLUENCE PRO</h1>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em]">89% Threshold Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right mr-4">
              <p className="text-[10px] text-slate-500 uppercase font-bold">Last Update</p>
              <p className="text-sm font-bold text-slate-300 mono">{state.lastUpdated || '--:--:--'}</p>
            </div>
            <button 
              onClick={runScanner}
              disabled={state.isScanning || selectedPairs.length === 0}
              className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all active:scale-95 ${
                state.isScanning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-lg shadow-emerald-500/20'
              }`}
            >
              {state.isScanning ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Inascan...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <span>Anza Scan Sasa</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8">
        {/* Selection Area */}
        <section className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
            Chagua Pairs za Kufanyia Analysis
          </h2>
          <div className="flex flex-wrap gap-2">
            {MAJOR_PAIRS.map(pair => (
              <button
                key={pair}
                onClick={() => togglePairSelection(pair)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                  selectedPairs.includes(pair)
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                {pair}
              </button>
            ))}
          </div>
        </section>

        {/* Results Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="inline-flex p-1 bg-slate-800 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === 'all' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Pairs Zote ({state.results.length})
            </button>
            <button
              onClick={() => setActiveTab('signals')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'signals' ? 'bg-emerald-500 text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Signals Pekee ({state.results.filter(r => r.signal === 'TAKE TRADE').length})
              {state.results.filter(r => r.signal === 'TAKE TRADE').length > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Results Grid */}
        {state.error ? (
          <div className="bg-rose-500/10 border border-rose-500/50 p-8 rounded-3xl text-center">
            <svg className="w-16 h-16 text-rose-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <h3 className="text-xl font-bold text-white mb-2">Makosa Yametokea</h3>
            <p className="text-slate-400">{state.error}</p>
          </div>
        ) : state.results.length === 0 && !state.isScanning ? (
          <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
            <svg className="w-20 h-20 text-slate-800 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <h3 className="text-2xl font-bold text-slate-600 mb-2">Hakuna Analysis Bado</h3>
            <p className="text-slate-700 max-w-md mx-auto">Bonyeza "Anza Scan Sasa" ili kupata confluence signals kulingana na data za TradingView na habari za masoko.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.isScanning && state.results.length === 0 ? (
              // Skeletal loading
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-80 bg-slate-800/50 rounded-2xl animate-pulse border border-slate-700" />
              ))
            ) : (
              filteredResults.length > 0 ? (
                filteredResults.map((analysis, idx) => (
                  <AnalysisCard key={idx} analysis={analysis} />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-slate-500 font-medium">
                  Hakuna signal inayopatikana kwa sasa inayofikia vigezo vya 89%.
                </div>
              )
            )}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 p-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-slate-500 text-sm text-center md:text-left">
            <p className="font-bold text-slate-400 mb-1">© 2024 Confluence Pro Market Scanner</p>
            <p>Iliyoandaliwa kwa matumizi ya TradingView real-time data analysis.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full text-xs font-bold border border-emerald-500/20">
              STRICT 89% CONFLUENCE
            </div>
            <div className="bg-slate-800 text-slate-400 px-4 py-2 rounded-full text-xs font-bold border border-slate-700">
              GLOBAL PAIRS SUPPORTED
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
