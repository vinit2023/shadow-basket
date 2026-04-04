import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { mealName, ingredients } = await req.json();
    if (!mealName) {
      return NextResponse.json({ error: "No meal name provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        text: `You are a professional chef. Give me a detailed recipe for "${mealName}" using these ingredients: ${ingredients?.join(", ") || "common ingredients"}.

Return a JSON object with these fields:
- name: string (recipe name)
- servings: number
- prepTime: string (e.g. "10 min")
- cookTime: string (e.g. "20 min")
- ingredients: string[] (list of ingredients with quantities)
- steps: string[] (step-by-step instructions, 5-8 steps)
- tips: string[] (2-3 pro tips)
- youtubeSearch: string (a YouTube search query to find a video tutorial for this exact recipe, be specific)

Return ONLY the JSON object, no markdown, no explanation.`,
      },
    ]);

    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const recipe = JSON.parse(cleaned);

    // Generate YouTube search URL
    recipe.youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.youtubeSearch || mealName + " recipe")}`;

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe error:", error);
    return NextResponse.json({ error: "Failed to get recipe" }, { status: 500 });
  }
}
