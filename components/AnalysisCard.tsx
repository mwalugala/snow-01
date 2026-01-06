
import React from 'react';
import { MarketAnalysis } from '../types';
import { TrendingUp, TrendingDown, Minus, Info, ExternalLink, CheckCircle, XCircle } from 'lucide-react';

// Use lucide-react standard approach - though instructed to use named imports, 
// for SVGs in React standard components often use libraries. I'll stick to raw SVGs for safety if needed, 
// but lucide is standard. Let's use clean SVGs to be safe.

interface Props {
  analysis: MarketAnalysis;
}

const AnalysisCard: React.FC<Props> = ({ analysis }) => {
  const isTakeTrade = analysis.signal === 'TAKE TRADE';
  
  return (
    <div className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
      isTakeTrade ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-700 bg-slate-800/50'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mono">{analysis.pair}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-semibold px-2 py-0.5 rounded ${
                analysis.direction === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 
                analysis.direction === 'SELL' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-500/20 text-slate-400'
              }`}>
                {analysis.direction}
              </span>
              <span className="text-slate-400 text-xs uppercase tracking-wider">Market Pair</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-black mono ${isTakeTrade ? 'text-emerald-400' : 'text-slate-400'}`}>
              {analysis.confluenceScore}%
            </div>
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Confluence</div>
          </div>
        </div>

        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
          isTakeTrade ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-700/50 text-slate-300'
        }`}>
          {isTakeTrade ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
          <span className="font-bold tracking-tighter text-lg">{analysis.signal}</span>
        </div>

        {isTakeTrade && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Entry</div>
              <div className="text-sm font-bold text-slate-200 mono">{analysis.entry}</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] text-rose-500/70 uppercase font-bold mb-1">Stop Loss</div>
              <div className="text-sm font-bold text-rose-400 mono">{analysis.stopLoss}</div>
            </div>
            <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700">
              <div className="text-[10px] text-emerald-500/70 uppercase font-bold mb-1">Take Profit</div>
              <div className="text-sm font-bold text-emerald-400 mono">{analysis.takeProfit}</div>
            </div>
          </div>
        )}

        <div className="space-y-2 mb-6">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <Info size={14} /> Analysis Reasoning
          </h4>
          <ul className="text-sm text-slate-300 space-y-1">
            {analysis.reasoning.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-emerald-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-slate-700/50 pt-4">
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Verified Sources</h4>
          <div className="flex flex-wrap gap-2">
            {analysis.sources.slice(0, 3).map((source, idx) => (
              <a 
                key={idx} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1 rounded border border-slate-700 flex items-center gap-1 transition-colors"
              >
                {source.title.substring(0, 15)}...
                <ExternalLink size={10} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simplified Icons for the component
const Info = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
);

const ExternalLink = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
);

export default AnalysisCard;
