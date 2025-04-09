// test-openai.ts
import { config } from "dotenv";
config(); // Load .env.local

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Say hello like a pirate" }],
    });
    console.log("✅ OpenAI response:", chat.choices[0].message.content);
  } catch (err) {
    console.error("❌ OpenAI failed:", err);
  }
}

testOpenAI();
