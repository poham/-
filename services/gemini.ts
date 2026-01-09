import { GoogleGenAI } from "@google/genai";

export async function generateNanoBananaImage(prompt: string, aspectRatio: string = "1:1"): Promise<string | null> {
  // Always use {apiKey: process.env.API_KEY} as per @google/genai guidelines.
  // Initialize right before making the call to ensure the latest state.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any
        }
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        // Find the image part (inlineData) in the response parts for nano banana models
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}