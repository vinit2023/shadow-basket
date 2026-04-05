import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });

  // Seed starter items for new user
  if (!error && data.user) {
    const seedItems = [
      { name: "Organic Whole Milk", category: "Dairy", unit_type: "gallons", current_stock_level: 1.5, max_stock_level: 2, daily_burn_rate: 0.25, last_restock_date: new Date(Date.now() - 4 * 86400000).toISOString(), user_id: data.user.id },
      { name: "Free-Range Eggs", category: "Protein", unit_type: "units", current_stock_level: 12, max_stock_level: 18, daily_burn_rate: 2, last_restock_date: new Date(Date.now() - 5 * 86400000).toISOString(), user_id: data.user.id },
      { name: "Avocados", category: "Produce", unit_type: "units", current_stock_level: 4, max_stock_level: 6, daily_burn_rate: 1, last_restock_date: new Date(Date.now() - 3 * 86400000).toISOString(), user_id: data.user.id },
      { name: "Chicken Breast", category: "Protein", unit_type: "lbs", current_stock_level: 3, max_stock_level: 5, daily_burn_rate: 0.75, last_restock_date: new Date(Date.now() - 2 * 86400000).toISOString(), user_id: data.user.id },
      { name: "Jasmine Rice", category: "Grains", unit_type: "lbs", current_stock_level: 5, max_stock_level: 10, daily_burn_rate: 0.3, last_restock_date: new Date(Date.now() - 7 * 86400000).toISOString(), user_id: data.user.id },
      { name: "Baby Spinach", category: "Produce", unit_type: "oz", current_stock_level: 10, max_stock_level: 16, daily_burn_rate: 2.5, last_restock_date: new Date(Date.now() - 3 * 86400000).toISOString(), user_id: data.user.id },
    ];
    await supabase.from("items").insert(seedItems);
  }

  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
}

export async function signInWithGitHub() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });
  return { data, error };
}
