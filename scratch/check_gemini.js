import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    // In current SDK, listModels might not be directly exposed or named differently
    // But we can try a basic generateContent with a safe model name
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro"];
    
    for (const name of modelNames) {
      console.log(`Testing model: ${name}...`);
      try {
        const model = genAI.getGenerativeModel({ model: name });
        const result = await model.generateContent("Hi");
        console.log(`Success with ${name}: ${result.response.text()}`);
        break; 
      } catch (e) {
        console.error(`Failed ${name}: ${e.message}`);
      }
    }
  } catch (err) {
    console.error("General error:", err);
  }
}

listModels();
