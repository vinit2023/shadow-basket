import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { image, mimeType } = await req.json();
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.2-90b-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType || "image/jpeg"};base64,${image}`,
              },
            },
            {
              type: "text",
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
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });

    const text = completion.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const items = JSON.parse(cleaned);

    const withDates = items.map((item: Record<string, unknown>) => ({
      ...item,
      last_restock_date: new Date().toISOString(),
    }));

    return NextResponse.json({ items: withDates });
  } catch (error) {
    console.error("Photo analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
  }
}
