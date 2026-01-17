import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });


app.get("/test", (req, res) => {
  res.send("Backend is working");
});


app.get("/", (req, res) => {
  res.send("Travel Planner API is active.");
});

app.post("/api/plan-trip", async (req, res) => {
  const { city, days, budget, interests } = req.body;

  console.log(`--- New Request ---`);
  console.log(`Destination: ${city}, Days: ${days}, Budget: ${budget}`);

  const prompt = `
    You are an expert travel planner.
    Please create a detailed ${days}-day travel itinerary for ${city}.
    Budget: ${budget}.
    Interests: ${interests}.

    Rules:
    1. Provide day-wise plan (Day 1, Day 2, etc.)
    2. Include tourist spots, food recommendations, and activities.
    3. Keep it clear, concise, and professional.
    4. Use full sentences.
    
    Begin the itinerary now.
  `;

  try {
    // 2. Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

 
    if (!text) {
      console.error("Gemini returned an empty string.");
      return res.status(500).json({ itinerary: "AI returned no content. Please try again." });
    }

    console.log("Successfully generated itinerary.");
    
    
    res.json({
      itinerary: text,
    });

  } catch (error) {
    console.error("--- GEMINI ERROR ---");
    console.error(error.message);

    // Specific handling for common errors
    if (error.message.includes("API key")) {
        res.status(500).json({ error: "Invalid API Key. Check your .env file." });
    } else if (error.message.includes("SAFETY")) {
        res.status(500).json({ error: "The prompt was flagged by safety filters." });

    }else if (error.status === 429) {
        console.error("QUOTA EXCEEDED: Slow down or wait for reset.");
        return res.status(429).json({ error: "Rate limit reached. Please try again in a minute." });
    }else {
        res.status(500).json({ error: "AI generation failed", details: error.message });
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Using API Key: ${process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌"}`);
});
