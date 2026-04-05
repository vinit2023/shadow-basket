import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { itemName, category } = await req.json();
    if (!itemName) {
      return NextResponse.json({ error: "No item name provided" }, { status: 400 });
    }

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a grocery price comparison assistant for India. Return ONLY valid JSON, no markdown, no explanation.",
        },
        {
          role: "user",
          content: `For the item "${itemName}" (category: ${category}), provide realistic current market prices from these Indian stores/apps.

Return a JSON array of price listings with these fields:
- store: string (one of: "BigBasket", "Zepto", "Swiggy Instamart", "Amazon Fresh", "Flipkart Grocery", "JioMart")
- price: number (in INR, realistic current price)
- originalPrice: number (MRP in INR, slightly higher than price)
- discount: number (percentage off)
- deliveryTime: string (e.g. "10 min", "30 min", "2-3 hours", "Next day")
- inStock: boolean (mostly true, occasionally false)
- unit: string (e.g. "1 kg", "500g", "1 L", "1 dozen", "1 pack")

Make prices realistic for Indian market. Vary prices between stores. Include at least 5-6 stores.

Return ONLY the JSON array.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const prices = JSON.parse(cleaned);

    return NextResponse.json({ prices });
  } catch (error) {
    console.error("Deal prices error:", error);
    return NextResponse.json({ error: "Failed to fetch prices" }, { status: 500 });
  }
}
