import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { items } = await req.json();
    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    const itemList = items.map((i: { name: string; current_stock_level: number; unit_type: string; category: string }) =>
      `${i.name} (${i.current_stock_level} ${i.unit_type}, ${i.category})`
    ).join("\n");

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a chef AI. Return ONLY valid JSON, no markdown, no explanation.",
        },
        {
          role: "user",
          content: `Given these available ingredients in my kitchen:

${itemList}

Suggest 6 meals I can make using ONLY these ingredients (basic pantry staples like salt, pepper, oil are assumed available).

Return a JSON array with these fields:
- name: string (meal name)
- usesItems: string[] (which items from my inventory this uses)
- prepTime: string (e.g. "15 min")
- calories: number (estimated)
- wasteReduction: string (brief note on how this reduces waste, e.g. "Uses spinach before it wilts")
- difficulty: string ("Easy", "Medium", or "Hard")

Return ONLY the JSON array.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const meals = JSON.parse(cleaned);

    return NextResponse.json({ meals });
  } catch (error) {
    console.error("Meal suggestion error:", error);
    return NextResponse.json({ error: "Failed to generate meal suggestions" }, { status: 500 });
  }
}
