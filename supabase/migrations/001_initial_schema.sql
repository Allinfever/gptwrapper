-- ============================================
-- GPT Wrapper - Supabase Database Schema
-- ============================================
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. User Profiles Table
-- ============================================
-- Stores additional user info beyond auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. Correction History Table
-- ============================================
-- Stores user correction history
CREATE TABLE IF NOT EXISTS public.corrections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  original_text TEXT NOT NULL,
  corrected_text TEXT NOT NULL,
  rules_applied TEXT[] DEFAULT '{}',
  char_count INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.corrections ENABLE ROW LEVEL SECURITY;

-- Policies for corrections
CREATE POLICY "Users can view their own corrections"
  ON public.corrections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own corrections"
  ON public.corrections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own corrections"
  ON public.corrections FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_corrections_user_id ON public.corrections(user_id);
CREATE INDEX IF NOT EXISTS idx_corrections_created_at ON public.corrections(created_at DESC);

-- ============================================
-- 3. Daily Usage / Quotas Table
-- ============================================
-- Tracks daily correction usage per user
CREATE TABLE IF NOT EXISTS public.daily_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE DEFAULT CURRENT_DATE NOT NULL,
  correction_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Ensure one row per user per day
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;

-- Policies for daily_usage
CREATE POLICY "Users can view their own usage"
  ON public.daily_usage FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own usage"
  ON public.daily_usage FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage"
  ON public.daily_usage FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date ON public.daily_usage(user_id, date);

-- ============================================
-- 4. Automatic Profile Creation on Signup
-- ============================================
-- Trigger to create profile when new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. Updated_at Trigger Function
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Apply to daily_usage
DROP TRIGGER IF EXISTS update_daily_usage_updated_at ON public.daily_usage;
CREATE TRIGGER update_daily_usage_updated_at
  BEFORE UPDATE ON public.daily_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 6. Helper Functions
-- ============================================

-- Function to get user's remaining corrections for today
CREATE OR REPLACE FUNCTION public.get_remaining_corrections(p_user_id UUID, p_daily_limit INTEGER DEFAULT 50)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COALESCE(correction_count, 0) INTO v_count
  FROM public.daily_usage
  WHERE user_id = p_user_id AND date = CURRENT_DATE;
  
  IF v_count IS NULL THEN
    RETURN p_daily_limit;
  END IF;
  
  RETURN GREATEST(0, p_daily_limit - v_count);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment correction count
CREATE OR REPLACE FUNCTION public.increment_correction_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_new_count INTEGER;
BEGIN
  INSERT INTO public.daily_usage (user_id, date, correction_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date) 
  DO UPDATE SET 
    correction_count = public.daily_usage.correction_count + 1,
    updated_at = NOW()
  RETURNING correction_count INTO v_new_count;
  
  RETURN v_new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE! 
-- ============================================
-- Tables created:
-- - profiles: User profile data
-- - corrections: Correction history  
-- - daily_usage: Daily quota tracking
--
-- Features:
-- - RLS enabled on all tables
-- - Auto profile creation on signup
-- - Auto updated_at timestamps
-- - Helper functions for quota management
