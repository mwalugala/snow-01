
import { GoogleGenAI, Type } from "@google/genai";
import { MarketAnalysis } from "../types";

export const analyzeMarketPair = async (pair: string): Promise<MarketAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const prompt = `Perform a professional technical and fundamental analysis for ${pair} using current real-time data from sources like TradingView and market news. 
  Calculate a "Confluence Score" from 0 to 100 based on RSI, MACD, Moving Averages, Support/Resistance levels, and recent economic news.
  
  Strict Rule: 
  - If Confluence Score > 89, signal MUST be "TAKE TRADE".
  - If Confluence Score <= 89, signal MUST be "NOT TAKE TRADE".
  
  Provide Entry, Stop Loss, and Take Profit if a trade is recommended. 
  Explain the reasoning clearly in a list.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pair: { type: Type.STRING },
            confluenceScore: { type: Type.NUMBER },
            signal: { type: Type.STRING },
            direction: { type: Type.STRING },
            entry: { type: Type.STRING },
            stopLoss: { type: Type.STRING },
            takeProfit: { type: Type.STRING },
            reasoning: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["pair", "confluenceScore", "signal", "direction", "reasoning"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // Extract grounding sources
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Market Source",
      uri: chunk.web?.uri || "#"
    })) || [];

    return {
      ...data,
      sources
    };
  } catch (error) {
    console.error(`Error analyzing ${pair}:`, error);
    throw error;
  }
};
