"use client";

import { InventoryItem } from "@/lib/types";
import { motion } from "framer-motion";
import { Brain, Clock, Flame, ChefHat, Sparkles, RefreshCw, Loader2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface Props { items: InventoryItem[]; }

interface MealSuggestion {
  name: string;
  usesItems: string[];
  prepTime: string;
  calories: number;
  wasteReduction: string;
  difficulty: string;
}

const FALLBACK_MEALS: MealSuggestion[] = [
  { name: "Avocado Egg Toast", usesItems: ["Free-Range Eggs", "Sourdough Bread", "Avocados"], prepTime: "8 min", calories: 380, wasteReduction: "Uses 3 items expiring soon", difficulty: "Easy" },
  { name: "Greek Yogurt Smoothie Bowl", usesItems: ["Greek Yogurt", "Frozen Blueberries", "Almond Butter"], prepTime: "5 min", calories: 290, wasteReduction: "Uses yogurt before it expires", difficulty: "Easy" },
  { name: "Chicken Rice Bowl", usesItems: ["Chicken Breast", "Jasmine Rice", "Baby Spinach"], prepTime: "25 min", calories: 520, wasteReduction: "Uses chicken near expiry", difficulty: "Medium" },
  { name: "Spinach & Cheese Omelette", usesItems: ["Free-Range Eggs", "Baby Spinach", "Organic Whole Milk"], prepTime: "12 min", calories: 340, wasteReduction: "Prevents spinach waste", difficulty: "Easy" },
  { name: "Milk & Blueberry Pancakes", usesItems: ["Organic Whole Milk", "Free-Range Eggs", "Frozen Blueberries"], prepTime: "20 min", calories: 450, wasteReduction: "Uses milk before it turns", difficulty: "Medium" },
  { name: "Chips & Avocado Guacamole", usesItems: ["Avocados", "Tortilla Chips"], prepTime: "10 min", calories: 280, wasteReduction: "Avocados ripen fast — use now", difficulty: "Easy" },
];

export function MealsView({ items }: Props) {
  const [meals, setMeals] = useState<MealSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiPowered, setAiPowered] = useState(false);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/meal-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: items.map(i => ({ name: i.name, current_stock_level: i.current_stock_level, unit_type: i.unit_type, category: i.category })) }),
      });
      const data = await response.json();
      if (response.ok && data.meals) {
        setMeals(data.meals);
        setAiPowered(true);
      } else {
        setMeals(FALLBACK_MEALS);
        setAiPowered(false);
      }
    } catch {
      setMeals(FALLBACK_MEALS);
      setAiPowered(false);
    }
    setLoading(false);
  }, [items]);

  useEffect(() => {
    if (items.length > 0) fetchMeals();
    else { setMeals(FALLBACK_MEALS); setLoading(false); }
  }, [items, fetchMeals]);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3 px-4 py-3 bg-accent-2/5 border border-accent-2/20 rounded-xl flex-1">
          <Brain className="w-4 h-4 text-accent-2" />
          <p className="text-sm text-accent-2 font-medium">
            <span className="font-bold">{loading ? "Generating" : meals.length} meal ideas</span> {aiPowered ? "powered by Gemini AI" : "generated from your current inventory"}
          </p>
        </div>
        <motion.button onClick={fetchMeals} whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} className="ml-3 p-2.5 rounded-xl border border-card-border hover:border-accent-2/30 text-muted hover:text-accent-2 transition-all" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map((meal, i) => (
          <motion.div key={meal.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3, scale: 1.01 }} className="border border-card-border rounded-2xl bg-card p-5 hover:border-accent-2/20 transition-all group cursor-default">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-2/20 to-accent-2/5 flex items-center justify-center"><ChefHat className="w-5 h-5 text-accent-2" /></div>
              <span className="text-[10px] px-2 py-0.5 rounded-lg bg-accent-2/10 text-accent-2 font-mono font-bold">{meal.difficulty}</span>
            </div>
            <h3 className="text-sm font-bold group-hover:text-accent-2 transition-colors">{meal.name}</h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {meal.usesItems.map((item) => (
                <span key={item} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/[0.06] text-muted font-mono">{item}</span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-[10px] text-muted font-mono font-bold">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{meal.prepTime}</span>
              <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{meal.calories} cal</span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] text-success font-medium">
              <Sparkles className="w-3 h-3" />{meal.wasteReduction}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
