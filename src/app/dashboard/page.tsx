"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { LedgerView } from "@/components/dashboard/ledger-view";
import { RestockView } from "@/components/dashboard/restock-view";
import { DealsView } from "@/components/dashboard/deals-view";
import { MealsView } from "@/components/dashboard/meals-view";
import { WasteView } from "@/components/dashboard/waste-view";
import { InsightsView } from "@/components/dashboard/insights-view";
import { AddItemModal } from "@/components/dashboard/add-item-modal";
import { PhotoUploadModal } from "@/components/dashboard/photo-upload-modal";
import { MOCK_ITEMS } from "@/lib/mock-data";
import { InventoryItem } from "@/lib/types";
import { motion } from "framer-motion";

export type Tab = "ledger" | "restock" | "deals" | "meals" | "waste" | "insights";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("ledger");
  const [items, setItems] = useState<InventoryItem[]>(MOCK_ITEMS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleAddItem = (item: Omit<InventoryItem, "id" | "created_at">) => {
    setItems((prev) => [{ ...item, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...prev]);
    setShowAddModal(false);
  };

  const handlePhotoItems = (newItems: Omit<InventoryItem, "id" | "created_at">[]) => {
    const withIds = newItems.map((item) => ({ ...item, id: crypto.randomUUID(), created_at: new Date().toISOString() }));
    setItems((prev) => [...withIds, ...prev]);
    setShowPhotoModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeTab={activeTab} itemCount={items.length} onAddItem={() => setShowAddModal(true)} onPhotoUpload={() => setShowPhotoModal(true)} />
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1 overflow-auto p-6">
          {activeTab === "ledger" && <LedgerView items={items} />}
          {activeTab === "restock" && <RestockView items={items} />}
          {activeTab === "deals" && <DealsView items={items} />}
          {activeTab === "meals" && <MealsView items={items} />}
          {activeTab === "waste" && <WasteView items={items} />}
          {activeTab === "insights" && <InsightsView items={items} />}
        </motion.div>
      </main>
      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onAdd={handleAddItem} />}
      {showPhotoModal && <PhotoUploadModal onClose={() => setShowPhotoModal(false)} onItemsDetected={handlePhotoItems} />}
    </div>
  );
}
