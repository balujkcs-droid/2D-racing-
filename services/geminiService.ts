
import { GoogleGenAI, Type } from "@google/genai";
import { GameStats, TrackTheme } from "../types";

// Correctly initialize the client using the apiKey named parameter and process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getLiveCommentary(
  stats: GameStats, 
  theme: TrackTheme, 
  event: 'START' | 'CRASH' | 'SPEEDUP' | 'NEAR_MISS' | 'MILESTONE'
): Promise<string> {
  try {
    const prompt = `
      Event: ${event}
      Current Stats: Score ${stats.score}, Distance ${stats.distance.toFixed(0)}m, Near Misses ${stats.nearMisses}.
      Theme: ${theme.name} (${theme.vibe}).
      
      Act as a high-energy arcade racing commentator. Provide a very short (max 10 words) punchy comment about the current racing event. 
      The comment should match the ${theme.vibe} theme.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        maxOutputTokens: 30,
        temperature: 0.9,
      }
    });

    // Directly access the .text property from the response
    return response.text?.trim() || "Pedal to the metal!";
  } catch (error) {
    console.error("Gemini Commentary Error:", error);
    return "Keep driving!";
  }
}

export async function getPostRaceAnalysis(stats: GameStats, theme: TrackTheme): Promise<string> {
  try {
    const prompt = `
      Game Over Analysis:
      Final Score: ${stats.score}
      Total Distance: ${stats.distance.toFixed(0)}m
      Near Misses: ${stats.nearMisses}
      Top Speed: ${stats.topSpeed.toFixed(1)} units/sec
      Track: ${theme.name}

      Write a short, engaging 2-sentence summary of the driver's performance. 
      Use gaming slang and be encouraging but honest. Mention something specific from the stats.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Directly access the .text property from the response
    return response.text?.trim() || "Solid run! You handled those corners like a pro.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Tough break! Get back in the driver's seat and try again.";
  }
}