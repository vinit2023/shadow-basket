import { InventoryItem } from "./types";

export function daysSinceRestock(item: InventoryItem): number {
  const now = new Date();
  const restockDate = new Date(item.last_restock_date);
  const diffMs = now.getTime() - restockDate.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export function estimatedRemainingPercent(item: InventoryItem): number {
  const days = daysSinceRestock(item);
  const consumed = item.daily_burn_rate * days;
  const remaining = item.current_stock_level - consumed;
  const pct = (remaining / item.max_stock_level) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function daysUntilEmpty(item: InventoryItem): number {
  if (item.daily_burn_rate <= 0) return Infinity;
  const days = daysSinceRestock(item);
  const consumed = item.daily_burn_rate * days;
  const remaining = item.current_stock_level - consumed;
  if (remaining <= 0) return 0;
  return Math.round(remaining / item.daily_burn_rate);
}

export function burnRateLabel(rate: number): string {
  if (rate >= 2) return "HIGH";
  if (rate >= 0.5) return "MED";
  return "LOW";
}

export function statusColor(pct: number): string {
  if (pct <= 15) return "text-danger";
  if (pct <= 40) return "text-warning";
  return "text-success";
}

export function statusBgColor(pct: number): string {
  if (pct <= 15) return "bg-danger/20 border-danger/30";
  if (pct <= 40) return "bg-warning/20 border-warning/30";
  return "bg-success/20 border-success/30";
}
