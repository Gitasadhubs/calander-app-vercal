import { GoogleGenAI } from "@google/genai";

export const fetchMonthlyTheme = async (month: string, year: number): Promise<string> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.warn("API_KEY environment variable not set. Using fallback theme.");
    return 'A wonderful month awaits!';
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const prompt = `Generate a fun, one-sentence theme or a surprising historical fact for ${month} ${year}. For example, for October, you could say: "A month of spooky delights and cozy sweaters." or for July: "In July 1969, humanity first set foot on the moon." Keep it concise, engaging, and under 15 words.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text.trim();
    
    // Remove quotes if the API returns them
    if (text.startsWith('"') && text.endsWith('"')) {
      return text.slice(1, -1);
    }
    
    return text;
  } catch (error) {
    console.error('Error fetching data from Gemini API:', error);
    // Provide a graceful fallback
    return 'A wonderful month awaits!';
  }
};
