import { GoogleGenAI } from "@google/genai";
import { Coin } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePackLore = async (coins: Coin[], walletAddress: string): Promise<{ name: string; description: string }> => {
  try {
    const coinList = coins.map(c => `${c.name} (${c.chain})`).join(', ');
    
    const prompt = `
      You are a futuristic, cyberpunk curator for a high-end digital asset marketplace called "ThewClub".
      A user (Wallet: ${walletAddress}) has just minted a new "Creator Pack" containing the following coins: ${coinList}.

      Task:
      1. Generate a creative, mystical, or high-tech name for this specific pack based on the combination of coins.
      2. Write a short, engaging description (max 2 sentences) that describes the "energy" or "utility" of this pack. Use evocative language.

      Return JSON format:
      {
        "name": "Pack Name",
        "description": "Pack Description"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating lore:", error);
    return {
      name: "ThewClub Select Pack",
      description: "A curated selection of high-value creator assets forged in the digital realm."
    };
  }
};
