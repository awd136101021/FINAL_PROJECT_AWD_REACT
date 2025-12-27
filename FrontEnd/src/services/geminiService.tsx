import { GoogleGenAI } from "@google/genai";

// Load the Gemini API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


let ai: GoogleGenAI | null = null;

// Initialize Gemini AI
if (API_KEY && API_KEY.trim() !== "") {
  ai = new GoogleGenAI({ apiKey: API_KEY });
  console.log("✅ Gemini AI initialized successfully.");
} else {
  console.error("❌ Gemini API key not found. Please add your key in the .env file.");
}

const model = "gemini-2.5-flash";

// System instruction for chatbot behavior
const systemInstruction = `You are a friendly, professional, and well-structured AI assistant for the University of Gujrat (UoG), specializing in the Computer Science (CS) Department. Your sole purpose is to provide accurate, concise, and up-to-date information about the University of Gujrat, including its admissions, programs, faculty, courses, research areas, and campus life, with a primary focus on the Computer Science department. You must always use the search tool to find the most recent and authoritative information, giving top priority to content from the official University of Gujrat website. Every response should be clear, organized, and easy to read, using headings, bullet points, or short paragraphs where appropriate. Maintain a polite, student-friendly, and professional tone while ensuring that answers are fact-based and well-structured.Give reply in 4-5 lines max and in times new roman font and dont bold font. If a user asks a question unrelated to the University of Gujrat or its CS department, politely reply: “⚠️ I’m an AI assistant for the University of Gujrat and can only answer questions related to the university and its Computer Science department.”`;

export const getChatbotResponse = async (query: string): Promise<string> => {
  if (!ai) {
    return "I'm sorry, the AI assistant is not configured correctly. Please contact the site administrator.";
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: query,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    return response.text ?? "I'm sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("⚠️ Error getting response from Gemini API:", error);
    return "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later.";
  }
};
