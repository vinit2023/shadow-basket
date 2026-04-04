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

export function healthScore(item: InventoryItem): number {
  let score = 100;
  const remaining = estimatedRemainingPercent(item);
  const daysLeft = daysUntilEmpty(item);

  // Depletion penalty: score drops as remaining percentage decreases
  if (remaining <= 15) score -= 50;
  else if (remaining <= 30) score -= 30;
  else if (remaining <= 50) score -= 15;

  // Urgency penalty: score drops if running out within 3 days
  if (daysLeft <= 0) score -= 40;
  else if (daysLeft <= 1) score -= 30;
  else if (daysLeft <= 3) score -= 20;
  else if (daysLeft <= 7) score -= 10;

  // Safety threshold penalty
  const safetyThreshold = item.max_stock_level * 0.15;
  const currentRemaining = item.current_stock_level - (item.daily_burn_rate * daysSinceRestock(item));
  if (currentRemaining < safetyThreshold) score -= 15;

  return Math.max(0, Math.min(100, score));
}

export function healthScoreLabel(score: number): string {
  if (score >= 80) return "A+";
  if (score >= 60) return "B";
  if (score >= 40) return "C";
  if (score >= 20) return "D";
  return "F";
}

export function healthScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-accent";
  if (score >= 40) return "text-warning";
  return "text-danger";
}

export function getUrgentItems(items: InventoryItem[]): InventoryItem[] {
  return items.filter((item) => {
    const daysLeft = daysUntilEmpty(item);
    return daysLeft <= 3;
  });
}
