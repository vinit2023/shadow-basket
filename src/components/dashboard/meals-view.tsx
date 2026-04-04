"use client";

import { InventoryItem } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Clock, Flame, ChefHat, Sparkles, RefreshCw, Loader2, X, ExternalLink, UtensilsCrossed, Lightbulb, Play, Users } from "lucide-react";
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

interface RecipeDetails {
  name: string;
  servings: number;
  prepTime: string;
  cookTime: string;
  ingredients: string[];
  steps: string[];
  tips: string[];
  youtubeUrl: string;
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
  const [selectedMeal, setSelectedMeal] = useState<MealSuggestion | null>(null);
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loadingRecipe, setLoadingRecipe] = useState(false);

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

  const fetchRecipe = async (meal: MealSuggestion) => {
    setSelectedMeal(meal);
    setLoadingRecipe(true);
    setRecipe(null);
    try {
      const res = await fetch("/api/recipe-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealName: meal.name, ingredients: meal.usesItems }),
      });
      const data = await res.json();
      if (data.recipe) {
        setRecipe(data.recipe);
      }
    } catch {
      setRecipe(null);
    }
    setLoadingRecipe(false);
  };

  const closeRecipe = () => {
    setSelectedMeal(null);
    setRecipe(null);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3 px-4 py-3 bg-accent-2/5 border border-accent-2/20 rounded-xl flex-1">
          <Brain className="w-4 h-4 text-accent-2" />
          <p className="text-sm text-accent-2 font-medium">
            <span className="font-bold">{loading ? "Generating" : meals.length} meal ideas</span> {aiPowered ? "powered by Gemini AI" : "generated from your current inventory"}
            <span className="text-muted ml-2 text-[10px]">Click any meal for full recipe</span>
          </p>
        </div>
        <motion.button onClick={fetchMeals} whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }} className="ml-3 p-2.5 rounded-xl border border-card-border hover:border-accent-2/30 text-muted hover:text-accent-2 transition-all" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {meals.map((meal, i) => (
          <motion.div
            key={meal.name}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3, scale: 1.01 }}
            onClick={() => fetchRecipe(meal)}
            className="border border-card-border rounded-2xl bg-card p-5 hover:border-accent-2/20 transition-all group cursor-pointer"
          >
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

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedMeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={closeRecipe}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-card border border-card-border rounded-2xl p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black">{selectedMeal.name}</h2>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted font-mono">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{selectedMeal.prepTime}</span>
                    <span className="flex items-center gap-1"><Flame className="w-3 h-3" />{selectedMeal.calories} cal</span>
                    <span className="px-1.5 py-0.5 rounded bg-accent-2/10 text-accent-2 font-bold">{selectedMeal.difficulty}</span>
                  </div>
                </div>
                <button onClick={closeRecipe} className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {loadingRecipe ? (
                <div className="flex flex-col items-center py-16">
                  <Loader2 className="w-10 h-10 text-accent-2 animate-spin mb-4" />
                  <p className="text-sm text-muted font-medium">Generating recipe with Gemini AI...</p>
                  <p className="text-[10px] text-muted/50 mt-1">Ingredients, steps, tips & video links</p>
                </div>
              ) : recipe ? (
                <div className="space-y-6">
                  {/* Meta */}
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-2/5 border border-accent-2/20">
                      <Users className="w-3.5 h-3.5 text-accent-2" />
                      <span className="text-xs font-bold text-accent-2">{recipe.servings} servings</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-accent/5 border border-accent/20">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      <span className="text-xs font-bold text-accent">Prep {recipe.prepTime} · Cook {recipe.cookTime}</span>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                      <UtensilsCrossed className="w-4 h-4 text-accent-2" /> Ingredients
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {recipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs py-1.5 px-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-2/60" />
                          {ing}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                      <ChefHat className="w-4 h-4 text-accent-2" /> Steps
                    </h3>
                    <div className="space-y-3">
                      {recipe.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex gap-3"
                        >
                          <div className="w-6 h-6 shrink-0 rounded-full bg-accent-2/10 border border-accent-2/20 flex items-center justify-center text-[10px] font-bold text-accent-2">{i + 1}</div>
                          <p className="text-xs text-muted leading-relaxed pt-1">{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  {recipe.tips && recipe.tips.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-warning" /> Pro Tips
                      </h3>
                      <div className="space-y-2">
                        {recipe.tips.map((tip, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted py-2 px-3 rounded-lg bg-warning/5 border border-warning/10">
                            <Sparkles className="w-3 h-3 text-warning shrink-0 mt-0.5" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* YouTube Link */}
                  {recipe.youtubeUrl && (
                    <a
                      href={recipe.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 hover:bg-red-600/20 transition-all font-bold text-sm"
                    >
                      <Play className="w-4 h-4" />
                      Watch Recipe on YouTube
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted text-center py-12">Failed to load recipe. Try again.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
