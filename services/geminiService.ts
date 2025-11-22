import { GoogleGenAI } from "@google/genai";
import { Artifact } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize only if key exists to avoid immediate crashes in dev if missing
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateCuratorInsight = async (artifact: Artifact): Promise<string> => {
  if (!ai) {
    return "AI Curator is offline. Please configure your API Key.";
  }

  try {
    const prompt = `
      You are a sophisticated museum curator and art historian.
      Provide a creative, culturally rich description for a digital artifact titled "${artifact.title}" from the "${artifact.period}".
      The object looks like a ${artifact.type.toLowerCase()} and is ${artifact.color} in color.
      
      Write a short, engaging paragraph (max 100 words) describing its fictional history, cultural significance, and artistic merit.
      Make it sound like a high-end gallery plaque.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Fast response
      }
    });

    return response.text || "No insight available at this time.";
  } catch (error) {
    console.error("Error fetching curator insight:", error);
    return "The curator is currently unavailable due to a connection issue.";
  }
};
