"use client";

import { InventoryItem } from "@/lib/types";
import { estimatedRemainingPercent, daysUntilEmpty } from "@/lib/inventory";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, Zap, ShoppingCart, X, Loader2, CheckCircle2, Crown } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface Props {
  items: InventoryItem[];
}

interface StoreListing {
  store: string;
  price: number;
  originalPrice: number;
  discount: number;
  deliveryTime: string;
  inStock: boolean;
  unit: string;
}

export function DealsView({ items }: Props) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [prices, setPrices] = useState<StoreListing[]>([]);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [restockedItems, setRestockedItems] = useState<Set<string>>(new Set());

  const needsRestock = items
    .map((item) => ({
      ...item,
      pct: estimatedRemainingPercent(item),
      daysLeft: daysUntilEmpty(item),
    }))
    .filter((item) => item.daysLeft <= 10)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const fetchPrices = async (item: InventoryItem) => {
    setSelectedItem(item);
    setLoadingPrices(true);
    setPrices([]);
    try {
      const res = await fetch("/api/deal-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: item.name, category: item.category }),
      });
      const data = await res.json();
      if (data.prices) {
        setPrices(data.prices.sort((a: StoreListing, b: StoreListing) => a.price - b.price));
      }
    } catch {
      setPrices([]);
    }
    setLoadingPrices(false);
  };

  const handleRestocked = async (item: InventoryItem) => {
    await supabase
      .from("items")
      .update({
        current_stock_level: item.max_stock_level,
        last_restock_date: new Date().toISOString(),
      })
      .eq("id", item.id);

    setRestockedItems((prev) => new Set(prev).add(item.id));
  };

  const lowestPrice = prices.length > 0 ? prices[0].price : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 px-4 py-3 bg-accent/5 border border-accent/20 rounded-xl">
        <Zap className="w-4 h-4 text-accent" />
        <p className="text-sm text-accent">
          <span className="font-semibold">{needsRestock.length} items</span> need restocking — click any item to compare prices across stores
        </p>
      </motion.div>

      <div className="flex gap-6">
        {/* Items list */}
        <div className={`space-y-2 ${selectedItem ? "w-1/3" : "w-full"} transition-all`}>
          {needsRestock.length === 0 ? (
            <p className="text-sm text-muted py-12 text-center">All items are well-stocked.</p>
          ) : (
            needsRestock.map((item, idx) => {
              const isRestocked = restockedItems.has(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => !isRestocked && fetchPrices(item)}
                  className={`border rounded-xl p-4 transition-all cursor-pointer ${
                    isRestocked
                      ? "border-success/30 bg-success/5 opacity-60"
                      : selectedItem?.id === item.id
                      ? "border-accent/50 bg-accent/5"
                      : item.daysLeft <= 3
                      ? "border-danger/20 hover:border-danger/40 bg-card"
                      : "border-card-border hover:border-accent/20 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-[10px] text-muted font-mono mt-0.5">{item.category} · {item.pct}% left</p>
                    </div>
                    <div className="text-right">
                      {isRestocked ? (
                        <span className="text-xs text-success font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Restocked</span>
                      ) : (
                        <>
                          <p className={`text-lg font-mono font-bold ${item.daysLeft <= 1 ? "text-danger" : item.daysLeft <= 3 ? "text-warning" : "text-foreground"}`}>
                            {item.daysLeft === 0 ? "NOW" : `${item.daysLeft}d`}
                          </p>
                          <p className="text-[9px] text-muted font-mono">remaining</p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${isRestocked ? "bg-success" : item.pct <= 15 ? "bg-danger" : item.pct <= 40 ? "bg-warning" : "bg-success"}`} style={{ width: `${isRestocked ? 100 : item.pct}%` }} />
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Price comparison panel */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              className="flex-1 border border-card-border rounded-2xl bg-card p-5"
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold">{selectedItem.name}</h3>
                  <p className="text-[11px] text-muted font-mono flex items-center gap-1"><Tag className="w-3 h-3" />{selectedItem.category}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-1.5 rounded-lg hover:bg-white/5 text-muted hover:text-foreground transition-colors"><X className="w-4 h-4" /></button>
              </div>

              {loadingPrices ? (
                <div className="flex flex-col items-center py-12">
                  <Loader2 className="w-8 h-8 text-accent animate-spin mb-3" />
                  <p className="text-sm text-muted font-medium">Comparing prices across stores...</p>
                  <p className="text-[10px] text-muted/50 mt-1">BigBasket · Zepto · Swiggy · Amazon · Flipkart · JioMart</p>
                </div>
              ) : prices.length === 0 ? (
                <p className="text-sm text-muted text-center py-8">No prices found. Try again.</p>
              ) : (
                <div className="space-y-2">
                  {prices.map((listing, i) => {
                    const isCheapest = listing.price === lowestPrice;
                    return (
                      <motion.div
                        key={listing.store}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`border rounded-xl p-4 transition-all ${
                          isCheapest ? "border-success/40 bg-success/5" : "border-card-border bg-card"
                        } ${!listing.inStock ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {isCheapest && <Crown className="w-4 h-4 text-success" />}
                            <div>
                              <p className={`text-sm font-bold ${isCheapest ? "text-success" : ""}`}>
                                {listing.store}
                                {isCheapest && <span className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-success/20 text-success font-mono">LOWEST</span>}
                              </p>
                              <p className="text-[10px] text-muted font-mono mt-0.5">
                                {listing.unit} · {listing.deliveryTime} delivery
                                {!listing.inStock && " · Out of Stock"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-baseline gap-2">
                              <span className={`text-lg font-mono font-bold ${isCheapest ? "text-success" : "text-foreground"}`}>₹{listing.price}</span>
                              <span className="text-xs font-mono text-muted line-through">₹{listing.originalPrice}</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-success/10 text-success font-mono font-bold">{listing.discount}% OFF</span>
                          </div>
                        </div>

                        {listing.inStock && (
                          <div className="mt-3 flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-accent/10 border border-accent/20 rounded-lg text-accent hover:bg-accent/20 transition-all">
                              <ShoppingCart className="w-3 h-3" /> Add to Cart
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRestocked(selectedItem); }}
                              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-success/10 border border-success/20 rounded-lg text-success hover:bg-success/20 transition-all"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Item Restocked
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
