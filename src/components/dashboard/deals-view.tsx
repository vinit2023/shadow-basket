"use client";

import { InventoryItem } from "@/lib/types";
import { estimatedRemainingPercent } from "@/lib/inventory";
import { motion } from "framer-motion";
import { Tag, TrendingDown, ExternalLink, Zap } from "lucide-react";

interface Props {
  items: InventoryItem[];
}

interface MockDeal {
  itemName: string;
  store: string;
  originalPrice: string;
  salePrice: string;
  discount: number;
  expiresIn: string;
}

function generateMockDeals(items: InventoryItem[]): MockDeal[] {
  const lowItems = items.filter((i) => estimatedRemainingPercent(i) <= 40);
  const stores = ["Whole Foods", "Trader Joe's", "Costco", "Target", "Safeway"];
  const expirations = ["2h", "6h", "12h", "1d", "2d"];

  return lowItems.map((item, i) => {
    const originalPrice = (Math.random() * 8 + 2).toFixed(2);
    const discount = Math.floor(Math.random() * 30) + 10;
    const salePrice = (
      (parseFloat(originalPrice) * (100 - discount)) /
      100
    ).toFixed(2);
    return {
      itemName: item.name,
      store: stores[i % stores.length],
      originalPrice,
      salePrice,
      discount,
      expiresIn: expirations[i % expirations.length],
    };
  });
}

export function DealsView({ items }: Props) {
  const deals = generateMockDeals(items);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 px-4 py-3 bg-accent/5 border border-accent/20 rounded-xl"
      >
        <Zap className="w-4 h-4 text-accent" />
        <p className="text-sm text-accent">
          <span className="font-semibold">{deals.length} price drops</span>{" "}
          detected for items you&apos;re running low on
        </p>
      </motion.div>

      {/* Deals grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {deals.length === 0 ? (
          <p className="text-sm text-muted col-span-full py-12 text-center">
            No deals available. All items are well-stocked.
          </p>
        ) : (
          deals.map((deal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06 }}
            >
              <DealCard deal={deal} />
            </motion.div>
          ))
        )}
      </div>

      <p className="text-[10px] text-muted/30 font-mono text-center pt-4">
        SIMULATED DATA // PRICE INTELLIGENCE MODULE v0.1
      </p>
    </div>
  );
}

function DealCard({ deal }: { deal: MockDeal }) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="border border-card-border rounded-xl bg-card p-4 hover:border-accent/20 transition-all group cursor-default"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium group-hover:text-accent transition-colors">
            {deal.itemName}
          </p>
          <p className="text-[11px] text-muted font-mono mt-0.5 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            {deal.store}
          </p>
        </div>
        <span className="px-2 py-0.5 bg-success/10 border border-success/20 text-success text-[11px] font-mono rounded-md">
          -{deal.discount}%
        </span>
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-mono font-semibold text-foreground">
            ${deal.salePrice}
          </span>
          <span className="text-sm font-mono text-muted line-through">
            ${deal.originalPrice}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-muted">
          <TrendingDown className="w-3 h-3 text-danger" />
          Expires {deal.expiresIn}
        </div>
      </div>

      <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 text-xs font-medium bg-white/5 border border-card-border rounded-lg text-muted hover:text-accent hover:border-accent/30 transition-all">
        <ExternalLink className="w-3 h-3" />
        View Deal
      </button>
    </motion.div>
  );
}
