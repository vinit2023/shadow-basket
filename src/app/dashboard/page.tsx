"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { supabase, getUser } from "@/lib/supabase";
import { motion } from "framer-motion";

export type Tab = "ledger" | "restock" | "deals" | "meals" | "waste" | "insights";

export default function Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("ledger");
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getUser().then((user) => {
      if (!user) {
        router.push("/auth?mode=signin");
        return;
      }
      setUserId(user.id);
    });
  }, [router]);

  const fetchItems = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from("items")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error, using mock data:", error.message);
      setItems(MOCK_ITEMS);
    } else {
      setItems(data as InventoryItem[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (userId) fetchItems();
  }, [userId, fetchItems]);

  const handleAddItem = async (item: Omit<InventoryItem, "id" | "created_at">) => {
    const { data, error } = await supabase
      .from("items")
      .insert([{ ...item, user_id: userId }])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error.message);
      setItems((prev) => [{ ...item, id: crypto.randomUUID(), created_at: new Date().toISOString() }, ...prev]);
    } else {
      setItems((prev) => [data as InventoryItem, ...prev]);
    }
    setShowAddModal(false);
  };

  const handlePhotoItems = async (newItems: Omit<InventoryItem, "id" | "created_at">[]) => {
    const withUserId = newItems.map((item) => ({ ...item, user_id: userId }));
    const { data, error } = await supabase
      .from("items")
      .insert(withUserId)
      .select();

    if (error) {
      console.error("Insert error:", error.message);
      const withIds = newItems.map((item) => ({ ...item, id: crypto.randomUUID(), created_at: new Date().toISOString() }));
      setItems((prev) => [...withIds, ...prev]);
    } else {
      setItems((prev) => [...(data as InventoryItem[]), ...prev]);
    }
    setShowPhotoModal(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeTab={activeTab} itemCount={items.length} onAddItem={() => setShowAddModal(true)} onPhotoUpload={() => setShowPhotoModal(true)} items={items} />
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex flex-col items-center gap-3">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-accent/20 border-t-accent rounded-full" />
                <p className="text-sm text-muted font-mono">Loading inventory...</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "ledger" && <LedgerView items={items} />}
              {activeTab === "restock" && <RestockView items={items} />}
              {activeTab === "deals" && <DealsView items={items} />}
              {activeTab === "meals" && <MealsView items={items} />}
              {activeTab === "waste" && <WasteView items={items} />}
              {activeTab === "insights" && <InsightsView items={items} />}
            </>
          )}
        </motion.div>
      </main>
      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} onAdd={handleAddItem} />}
      {showPhotoModal && <PhotoUploadModal onClose={() => setShowPhotoModal(false)} onItemsDetected={handlePhotoItems} />}
    </div>
  );
}
