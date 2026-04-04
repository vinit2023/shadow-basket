import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
  }

  try {
    const { image, mimeType } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          data: image,
          mimeType: mimeType || "image/jpeg",
        },
      },
      {
        text: `Analyze this pantry/kitchen/grocery photo. Identify all visible food and grocery items.

Return a JSON array of objects with these fields:
- name: string (item name, e.g. "Organic Whole Milk")
- category: string (one of: Produce, Dairy, Protein, Grains, Beverages, Snacks, Condiments, Frozen, Other)
- unit_type: string (e.g. "bottles", "lbs", "oz", "gallons", "units", "cans", "bags", "boxes", "packs")
- current_stock_level: number (estimated quantity visible)
- max_stock_level: number (estimated max capacity, usually 1.5x-2x current)
- daily_burn_rate: number (estimated daily consumption rate for a typical household)

Return ONLY the JSON array, no markdown, no explanation. Example:
[{"name":"Whole Milk","category":"Dairy","unit_type":"gallons","current_stock_level":1,"max_stock_level":2,"daily_burn_rate":0.25}]`,
      },
    ]);

    const text = result.response.text();
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const items = JSON.parse(cleaned);

    const withDates = items.map((item: Record<string, unknown>) => ({
      ...item,
      last_restock_date: new Date().toISOString(),
    }));

    return NextResponse.json({ items: withDates });
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
