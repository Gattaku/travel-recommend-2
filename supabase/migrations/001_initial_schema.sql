-- Migration: 001_initial_schema
-- Feature: 家族旅行プランナー（提案・保存・しおり作成）
-- Created: 2026-03-22

-- ============================================================
-- 1. family_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS public.family_profiles (
  id           UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  adult_count  INT         NOT NULL DEFAULT 2 CHECK (adult_count >= 1 AND adult_count <= 10),
  children_ages INT[]      NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE public.family_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "family_profiles: owner read"
  ON public.family_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "family_profiles: owner insert"
  ON public.family_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "family_profiles: owner update"
  ON public.family_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "family_profiles: owner delete"
  ON public.family_profiles FOR DELETE
  USING (auth.uid() = id);

-- ============================================================
-- 2. trip_proposals (Claude が生成した提案セット)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.trip_proposals (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  condition    JSONB       NOT NULL,      -- { season, budget, style, area }
  destinations JSONB       NOT NULL,      -- Claude レスポンスのスナップショット
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trip_proposals_user_id ON public.trip_proposals(user_id);

ALTER TABLE public.trip_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "trip_proposals: owner read"
  ON public.trip_proposals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "trip_proposals: owner insert"
  ON public.trip_proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "trip_proposals: owner delete"
  ON public.trip_proposals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 3. saved_proposals (ユーザーが保存した単一旅行先)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.saved_proposals (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proposal_id  UUID        REFERENCES public.trip_proposals(id) ON DELETE SET NULL,
  destination  JSONB       NOT NULL,  -- 保存時点のスナップショット
  memo         TEXT        NOT NULL DEFAULT '',
  is_decided   BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_proposals_user_id ON public.saved_proposals(user_id);

ALTER TABLE public.saved_proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "saved_proposals: owner read"
  ON public.saved_proposals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "saved_proposals: owner insert"
  ON public.saved_proposals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_proposals: owner update"
  ON public.saved_proposals FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "saved_proposals: owner delete"
  ON public.saved_proposals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. itineraries (旅のしおり)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.itineraries (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  saved_proposal_id   UUID        REFERENCES public.saved_proposals(id) ON DELETE SET NULL,
  title               TEXT        NOT NULL,
  travel_dates        JSONB       DEFAULT '{"start": null, "end": null}',
  schedule            JSONB       NOT NULL DEFAULT '[]',
  accommodation       JSONB       NOT NULL DEFAULT '{}',
  packing_list        JSONB       NOT NULL DEFAULT '[]',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_itineraries_user_id ON public.itineraries(user_id);
CREATE INDEX idx_itineraries_saved_proposal_id ON public.itineraries(saved_proposal_id);

ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "itineraries: owner read"
  ON public.itineraries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "itineraries: owner insert"
  ON public.itineraries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "itineraries: owner update"
  ON public.itineraries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "itineraries: owner delete"
  ON public.itineraries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- 5. updated_at trigger (全テーブル共通)
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_family_profiles_updated_at
  BEFORE UPDATE ON public.family_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_saved_proposals_updated_at
  BEFORE UPDATE ON public.saved_proposals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_itineraries_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
