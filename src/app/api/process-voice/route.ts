import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  try {
    const { text, existingItems } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const itemList = existingItems?.length > 0
      ? `\nExisting items in inventory: ${existingItems.map((i: { name: string }) => i.name).join(", ")}`
      : "";

    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are the Shadow Basket Brain — a voice command processor for a kitchen inventory app. Parse the user's spoken command and return ONLY valid JSON.

The user will say things like:
- "Add milk" or "Add 2 gallons of milk" → add item
- "I'm out of eggs" or "We finished the butter" → mark item as empty (restock)
- "Restock rice" or "I bought bread" → mark item as fully restocked
- "Remove chicken" or "Delete the yogurt" → delete item
- "How much milk do I have?" → query item

${itemList}

Return ONLY a JSON object with these fields:
- action: "add" | "empty" | "restock" | "delete" | "query" | "unknown"
- item: string (the item name, normalized — e.g. "milk" not "some milk")
- quantity: number | null (if mentioned)
- unit: string | null (e.g. "gallons", "lbs", "units", "kg", "dozen")
- category: string | null (one of: Produce, Dairy, Protein, Grains, Beverages, Snacks, Condiments, Frozen, Other — guess based on item)
- confidence: number (0-1, how confident you are in the parsing)
- response: string (a short friendly confirmation to speak back, e.g. "Got it! Adding milk to your inventory.")

Return ONLY the JSON object. No markdown.`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 256,
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ command: parsed });
  } catch (error) {
    console.error("Voice processing error:", error);
    return NextResponse.json({ error: "Failed to process voice command" }, { status: 500 });
  }
}
