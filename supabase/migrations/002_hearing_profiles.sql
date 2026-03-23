-- Migration: 002_hearing_profiles
-- Feature: インタラクティブ・ヒアリング機能
-- Created: 2026-03-23

-- ============================================================
-- hearing_profiles (好みプロフィール)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hearing_profiles (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences  JSONB       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 1 user = 1 profile
CREATE UNIQUE INDEX idx_hearing_profiles_user_id ON public.hearing_profiles(user_id);

-- RLS
ALTER TABLE public.hearing_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hearing_profiles: owner read"
  ON public.hearing_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "hearing_profiles: owner insert"
  ON public.hearing_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "hearing_profiles: owner update"
  ON public.hearing_profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "hearing_profiles: owner delete"
  ON public.hearing_profiles FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_hearing_profiles_updated_at
  BEFORE UPDATE ON public.hearing_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
