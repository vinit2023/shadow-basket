# Shadow Basket

### The AI-Native Command Center for Home Inventory

> *"Life's too short to count eggs. Let Shadow remember for you."*

---

## What is Shadow Basket?

Shadow Basket is an AI-powered grocery inventory management platform — think of it as the **Bloomberg Terminal for your kitchen**. It replaces the chaos of forgotten groceries, wasted food, and emergency store runs with a single intelligent dashboard.

Instead of manually tracking what you have, Shadow Basket lets you:
- **Snap a photo** of your pantry and AI identifies every item instantly
- **Speak a command** like "Hey Shadow, add milk" and your inventory updates hands-free
- **See predictions** on when items will run out before they actually do
- **Compare prices** across 6 major stores and buy with one click

---

## The Problem

Every household faces the same cycle:
- You forget what you have at home and buy duplicates
- Food expires in the back of the fridge, wasted
- You run out of essentials at the worst time
- You overspend because you never compare prices

The result? The average household wastes **$1,500/year** in food and makes **2.5 unnecessary grocery trips/month**.

---

## How Shadow Basket Helps

| Pain Point | Shadow Basket Solution |
|---|---|
| "What do I even have at home?" | AI photo scanning catalogues your pantry in 1.8 seconds |
| "I forgot to buy milk — again" | Predictive restock alerts flag items 72 hours before they run out |
| "This food went bad before I used it" | Burn rate tracking + waste analytics shows what you're throwing away |
| "Am I getting the best price?" | Real-time price comparison across BigBasket, Zepto, Swiggy, Amazon, Flipkart, JioMart |
| "What can I cook with what I have?" | AI meal planner suggests recipes from your current inventory |
| "I hate typing everything manually" | Voice commands: just say "Hey Shadow, add eggs" |

---

## The Business

Shadow Basket targets a massive market:
- **$7.6T global grocery market** (2025)
- **60% of households** actively track groceries in some form (notes, apps, memory)
- **Zero dominant player** in AI-native home inventory management

**Revenue model:**
- Freemium (free during beta, no limits)
- Premium tier: advanced analytics, household sync, priority AI
- B2B: restaurant/commercial kitchen inventory management

---

## The Dashboard

The dashboard is organized into **6 core modules**, each solving a specific problem:

### 1. Smart Ledger
The home screen. A real-time table of every item in your inventory with:
- **Stock health grades** (A+ to F) based on current vs. max stock
- **Burn rate indicators** (HIGH / MED / LOW) showing consumption speed
- **Estimated remaining %** with color-coded progress bars
- **Edit and delete** any item inline
- **Last purchased** timestamps with relative dates

### 2. Predictive Restock
Items predicted to deplete within 72 hours are flagged as **CRITICAL**. Items within 4-7 days go to the **WATCH LIST**. Each card shows:
- Days remaining until empty
- Current stock level and burn rate
- One-click "Mark Restocked" button that resets stock to max

### 3. Smart Deals
Click any low-stock item to see **AI-generated price comparisons** across 6 Indian grocery stores:
- BigBasket, Zepto, Swiggy Instamart, Amazon Fresh, Flipkart Grocery, JioMart
- Lowest price highlighted with a crown badge
- Discount percentages and delivery time estimates
- **"Buy on [Store]"** button opens the actual store search page
- "Item Restocked" button to mark as purchased

### 4. AI Meal Planner
Generates **6 meal suggestions** based on what you currently have in stock:
- Meal name, prep time, calorie estimate, difficulty level
- Click any meal for the **full recipe**: ingredients, step-by-step instructions, pro tips
- **YouTube tutorial links** for each recipe
- Waste reduction notes showing how the meal uses items that are about to expire

### 5. Waste Analytics
Track your household's sustainability:
- **Overall waste score** (A+ to F)
- Category-by-category breakdown (which categories waste the most)
- At-risk items that are close to expiring
- AI-generated tips to reduce waste based on your actual consumption patterns

### 6. Spending Insights
Visual dashboards showing:
- Stock distribution by category (pie chart data)
- Average stock health across all items
- Total items tracked vs. items needing attention
- Consumption rate analysis

---

## Voice Commands — "Hey Shadow"

Shadow Basket includes a built-in voice assistant powered by AI:

**How it works:**
1. Click the floating mic button (bottom-right of dashboard)
2. Allow microphone access
3. Say **"Hey Shadow"** followed by your command
4. AI parses your intent and executes instantly
5. Shadow speaks back to confirm the action

**Supported commands:**

| You say | What happens |
|---|---|
| "Hey Shadow, add 2 gallons of milk" | Adds milk to your inventory (Dairy, 2 gallons) |
| "Hey Shadow, I'm out of eggs" | Sets eggs stock to 0 |
| "Hey Shadow, restock the rice" | Resets rice to max stock level |
| "Hey Shadow, delete yogurt" | Removes yogurt from inventory |
| "Hey Shadow, how much bread do I have?" | Speaks back your current stock level |

**Technical details:**
- **Wake word detection:** Browser SpeechRecognition API (zero-cost, client-side)
- **Intent parsing:** Groq Llama 3.3 70B (server-side)
- **Response:** SpeechSynthesis API (text-to-speech, client-side)
- Works best in **Google Chrome**

---

## Photo Scanning — AI Vision

Point your camera at any shelf, fridge, or pantry:

1. Click the **Scan** button in the dashboard header
2. Upload or take a photo
3. **Llama 3.2 90B Vision** analyzes the image
4. Detected items are automatically added to your inventory with:
   - Item name
   - Estimated quantity
   - Category (auto-detected)
   - Suggested burn rate

One photo replaces minutes of manual data entry.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, `src/` directory) |
| **Language** | TypeScript 5 |
| **UI** | React 18 + Tailwind CSS 3.4 |
| **Animations** | Framer Motion 12 + GSAP 3.14 (ScrollTrigger) |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth (Email, Google OAuth, GitHub OAuth) |
| **Bot Protection** | Google reCAPTCHA v2 |
| **AI — Text** | Groq API + Llama 3.3 70B Versatile |
| **AI — Vision** | Groq API + Llama 3.2 90B Vision Preview |
| **Voice Input** | Browser Web Speech API (SpeechRecognition) |
| **Voice Output** | Browser SpeechSynthesis API |
| **Icons** | Lucide React |
| **Fonts** | Inter (sans) + JetBrains Mono (mono) |
| **Deployment** | Vercel |
| **Source Control** | GitHub |

---

## AI Integrations

All AI features are powered by **Groq** (ultra-fast LLM inference):

| Feature | Model | What it does |
|---|---|---|
| Voice Commands | Llama 3.3 70B | Parses natural language into structured actions (add/delete/restock/query) |
| Photo Scanning | Llama 3.2 90B Vision | Identifies grocery items from photos with quantities and categories |
| Meal Suggestions | Llama 3.3 70B | Generates 6 recipes from current inventory items |
| Recipe Details | Llama 3.3 70B | Full recipe with ingredients, steps, tips, and YouTube links |
| Price Comparison | Llama 3.3 70B | Generates realistic price data across 6 Indian grocery stores |

**Why Groq?**
- Free tier with generous limits
- Ultra-fast inference (sub-second responses)
- Access to latest Llama models (Meta's open-source LLMs)
- No quota issues (unlike Gemini/OpenAI free tiers)

---

## Authentication

Three sign-in methods:

1. **Email + Password** — Standard signup with reCAPTCHA verification
2. **Google OAuth** — One-click Google sign-in
3. **GitHub OAuth** — One-click GitHub sign-in

New users get **6 starter items** automatically seeded into their inventory (Milk, Eggs, Avocados, Chicken Breast, Basmati Rice, Baby Spinach) so the dashboard isn't empty on first visit.

---

## Database Schema

**Table: `items`**

| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | Foreign key to Supabase auth user |
| `name` | Text | Item name (e.g., "Organic Milk") |
| `category` | Text | One of: Produce, Dairy, Protein, Grains, Beverages, Snacks, Condiments, Frozen, Other |
| `unit_type` | Text | Unit of measurement (bags, lbs, oz, gallons, liters, bottles, cans, boxes, packs, units) |
| `current_stock_level` | Float | Current quantity in stock |
| `max_stock_level` | Float | Maximum capacity (used for restock calculations) |
| `daily_burn_rate` | Float | Estimated daily consumption rate |
| `last_restock_date` | Timestamp | When the item was last restocked |
| `created_at` | Timestamp | Row creation time |

Row Level Security (RLS) ensures users can only access their own items.

---

## Deployment

**Platform:** Vercel

**Live URL:** https://shadow-basket.vercel.app

**GitHub:** https://github.com/vinit2023/shadow-basket

**Environment variables required:**
```
NEXT_PUBLIC_SUPABASE_URL        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY   # Supabase anonymous/public key
GROQ_API_KEY                    # Groq API key for AI features
```

**Build commands:**
```bash
npm run dev          # Local development (localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npx vercel --prod    # Deploy to Vercel
```

---

## Project Structure

```
src/
  app/
    page.tsx                    # Landing page
    auth/page.tsx               # Auth page (signup/signin)
    dashboard/page.tsx          # Main dashboard
    onboarding/page.tsx         # New user onboarding
    api/
      analyze-photo/route.ts    # AI vision endpoint
      deal-prices/route.ts      # Price comparison endpoint
      meal-suggestions/route.ts # Meal planner endpoint
      recipe-details/route.ts   # Recipe details endpoint
      process-voice/route.ts    # Voice command endpoint
  components/
    landing/                    # Landing page sections (hero, features, demo, etc.)
    dashboard/                  # Dashboard modules (ledger, restock, deals, etc.)
    auth/                       # Auth page components
  lib/
    supabase.ts                 # Supabase client + auth functions
    types.ts                    # TypeScript interfaces + constants
    inventory.ts                # Burn rate, health score, stock calculations
    utils.ts                    # Utility functions (cn, etc.)
    mock-data.ts                # Fallback mock data
```

---

## Landing Page

The landing page is designed as a storytelling scroll experience:

1. **Hero** — Headline, tagline, voice command examples, CTA
2. **Dashboard Preview** — Interactive 3D card showing the actual UI
3. **Features** — 9 modules showcased with interactive tabs and animated stats
4. **How It Works** — Photo/Voice mode toggle showing the full pipeline
5. **Testimonials** — Social proof with rotating cards
6. **CTA** — Final signup push with trust badges
7. **Footer** — Links, social, system status

**Animation stack:**
- GSAP ScrollTrigger for scroll-driven parallax and reveals
- Framer Motion for component-level animations and shared layout transitions
- Glassmorphism (backdrop-blur, layered transparent cards)
- Animated gradient text and mesh backgrounds

---

*Built with AI. Designed for humans. Powered by Shadow.*
