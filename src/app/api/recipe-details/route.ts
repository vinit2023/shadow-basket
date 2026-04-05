import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { mealName, ingredients } = await req.json();
    if (!mealName) {
      return NextResponse.json({ error: "No meal name provided" }, { status: 400 });
    }

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a professional chef. Return ONLY valid JSON, no markdown, no explanation.",
        },
        {
          role: "user",
          content: `Give me a detailed recipe for "${mealName}" using these ingredients: ${ingredients?.join(", ") || "common ingredients"}.

Return a JSON object with these fields:
- name: string (recipe name)
- servings: number
- prepTime: string (e.g. "10 min")
- cookTime: string (e.g. "20 min")
- ingredients: string[] (list of ingredients with quantities)
- steps: string[] (step-by-step instructions, 5-8 steps)
- tips: string[] (2-3 pro tips)
- youtubeSearch: string (a YouTube search query to find a video tutorial for this exact recipe, be specific)

Return ONLY the JSON object.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const recipe = JSON.parse(cleaned);

    recipe.youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(recipe.youtubeSearch || mealName + " recipe")}`;

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe error:", error);
    return NextResponse.json({ error: "Failed to get recipe" }, { status: 500 });
  }
}
