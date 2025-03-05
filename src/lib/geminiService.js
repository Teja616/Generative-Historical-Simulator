import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
// You'll need to set this in your environment variables or config
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize the API client
const genAI = new GoogleGenerativeAI(API_KEY);

// Create a function to generate responses using Gemini API
export async function generateGeminiResponse(prompt) {
  try {
    // If no API key is provided, throw an error to trigger fallback
    if (!API_KEY) {
      throw new Error("No API key provided");
    }
    
    // Configuration for the Gemini model
    const generationConfig = {
      temperature: 0.7,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 700,
    };

    // System prompt for historical alternate timelines
    const systemPrompt = 
      "You are an AI assistant specialized in Generative Historical Event Simulation. " +
      "Only answer questions related to historical event simulation, and generate alternate history scenarios. " +
      "If the question is unrelated, politely refuse to answer.";

    // Initialize the model with the specified configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
    });

    // Generate content based on the user's prompt with the system prompt
    const result = await model.generateContent([
      systemPrompt,
      prompt
    ]);
    
    return result.response.text();
  } catch (error) {
    console.error("Error generating response from Gemini:", error);
    return "I'm having trouble connecting to my brain right now. Please try again in a moment.";
  }
}