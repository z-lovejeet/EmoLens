-- Migration 001: Create Tables

CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  preferences     JSONB NOT NULL DEFAULT '{"theme":"system","reducedMotion":false,"sensoryPreferences":[]}'::jsonb,
  onboarding_complete  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS checkins (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body_data         JSONB NOT NULL,
  context           TEXT,
  ai_suggestions    JSONB,
  selected_emotion  TEXT,
  thread_id         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS emotion_dictionary (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  emotion             TEXT NOT NULL,
  body_patterns       JSONB NOT NULL DEFAULT '[]'::jsonb,
  frequency           INTEGER NOT NULL DEFAULT 1,
  effective_coping    TEXT[] NOT NULL DEFAULT '{}',
  ineffective_coping  TEXT[] NOT NULL DEFAULT '{}',
  first_identified    TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_identified     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, emotion)
);

CREATE TABLE IF NOT EXISTS coping_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checkin_id      UUID REFERENCES checkins(id) ON DELETE SET NULL,
  strategy_name   TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('breathing','movement','sensory','grounding','cognitive')),
  was_helpful     BOOLEAN,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS communication_cards (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  checkin_id          UUID REFERENCES checkins(id) ON DELETE SET NULL,
  emotion             TEXT NOT NULL,
  intensity_level     TEXT NOT NULL CHECK (intensity_level IN ('mild','moderate','strong')),
  what_helps_me       TEXT[] NOT NULL DEFAULT '{}',
  validation_message  TEXT,
  is_shareable        BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Migration 002: Create Indexes

CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON checkins(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checkins_thread ON checkins(thread_id) WHERE thread_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_dictionary_user ON emotion_dictionary(user_id);
CREATE INDEX IF NOT EXISTS idx_coping_user_date ON coping_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_coping_checkin ON coping_log(checkin_id) WHERE checkin_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_cards_user ON communication_cards(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cards_shareable ON communication_cards(id) WHERE is_shareable = true;

-- Migration 003: Enable RLS and Create Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotion_dictionary ENABLE ROW LEVEL SECURITY;
ALTER TABLE coping_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_cards ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_select_own') THEN
    CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'profiles_update_own') THEN
    CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'checkins_insert_own') THEN
    CREATE POLICY checkins_insert_own ON checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'checkins_select_own') THEN
    CREATE POLICY checkins_select_own ON checkins FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'checkins_update_own') THEN
    CREATE POLICY checkins_update_own ON checkins FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'dictionary_all_own') THEN
    CREATE POLICY dictionary_all_own ON emotion_dictionary FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'coping_all_own') THEN
    CREATE POLICY coping_all_own ON coping_log FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cards_all_own') THEN
    CREATE POLICY cards_all_own ON communication_cards FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'cards_read_shareable') THEN
    CREATE POLICY cards_read_shareable ON communication_cards FOR SELECT USING (is_shareable = true);
  END IF;
END $$;

-- Migration 004: Create Triggers

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'full_name',
      NEW.raw_user_meta_data ->> 'name',
      split_part(NEW.email, '@', 1)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_profiles ON profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_dictionary ON emotion_dictionary;
CREATE TRIGGER set_updated_at_dictionary
  BEFORE UPDATE ON emotion_dictionary
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
