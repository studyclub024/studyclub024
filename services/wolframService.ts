
/**
 * WolframAlpha API Service
 * Handles high-precision symbolic computation to verify Gemini's reasoning.
 */

const WOLFRAM_APPID = (process.env as any).WOLFRAM_APPID || 'DEMO';

// Using the Short Answer API for deterministic verification
// Note: In a production environment, this should ideally be proxied to avoid CORS issues
export const queryWolframAlpha = async (input: string): Promise<string | null> => {
  if (WOLFRAM_APPID === 'DEMO') return null;
  
  try {
    const encodedInput = encodeURIComponent(input);
    // Using the "Short Answer" API for rapid verification
    const url = `https://api.wolframalpha.com/v1/result?appid=${WOLFRAM_APPID}&i=${encodedInput}`;
    
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    }
    return null;
  } catch (error) {
    console.error("WolframAlpha Query Failed:", error);
    return null;
  }
};

export const getWolframSpokenResult = async (input: string): Promise<string | null> => {
  if (WOLFRAM_APPID === 'DEMO') return null;
  
  try {
    const encodedInput = encodeURIComponent(input);
    const url = `https://api.wolframalpha.com/v1/spoken?appid=${WOLFRAM_APPID}&i=${encodedInput}`;
    
    const response = await fetch(url);
    if (response.ok) {
      return await response.text();
    }
    return null;
  } catch (error) {
    return null;
  }
};
