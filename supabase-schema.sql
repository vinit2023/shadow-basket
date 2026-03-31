-- Shadow Inventory: Supabase Schema
-- Run this in your Supabase SQL Editor to set up the database

CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Other',
  unit_type TEXT NOT NULL DEFAULT 'units',
  current_stock_level NUMERIC NOT NULL DEFAULT 0,
  max_stock_level NUMERIC NOT NULL DEFAULT 1,
  daily_burn_rate NUMERIC NOT NULL DEFAULT 0,
  last_restock_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (tighten with auth later)
CREATE POLICY "Allow public access" ON items
  FOR ALL USING (true) WITH CHECK (true);

-- Seed data
INSERT INTO items (name, category, unit_type, current_stock_level, max_stock_level, daily_burn_rate, last_restock_date) VALUES
  ('Organic Whole Milk', 'Dairy', 'gallons', 1.5, 2, 0.25, NOW() - INTERVAL '4 days'),
  ('Sourdough Bread', 'Grains', 'units', 2, 3, 0.5, NOW() - INTERVAL '3 days'),
  ('Free-Range Eggs', 'Protein', 'units', 12, 18, 2, NOW() - INTERVAL '5 days'),
  ('Avocados', 'Produce', 'units', 4, 6, 1, NOW() - INTERVAL '3 days'),
  ('Greek Yogurt', 'Dairy', 'oz', 32, 32, 6, NOW() - INTERVAL '4 days'),
  ('Chicken Breast', 'Protein', 'lbs', 3, 5, 0.75, NOW() - INTERVAL '2 days'),
  ('Jasmine Rice', 'Grains', 'lbs', 5, 10, 0.3, NOW() - INTERVAL '7 days'),
  ('Sparkling Water', 'Beverages', 'cans', 18, 24, 3, NOW() - INTERVAL '5 days'),
  ('Baby Spinach', 'Produce', 'oz', 10, 16, 2.5, NOW() - INTERVAL '3 days'),
  ('Almond Butter', 'Condiments', 'oz', 16, 16, 0.5, NOW() - INTERVAL '10 days'),
  ('Frozen Blueberries', 'Frozen', 'bags', 2, 3, 0.4, NOW() - INTERVAL '4 days'),
  ('Tortilla Chips', 'Snacks', 'bags', 1, 2, 0.3, NOW() - INTERVAL '2 days');
