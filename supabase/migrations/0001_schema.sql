-- ============================================================================
-- Free Traveler Database Schema - 6 Core Tables
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. profiles — User profiles
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  nickname VARCHAR(255) NOT NULL UNIQUE,
  age_group VARCHAR(50),
  gender VARCHAR(50),
  style VARCHAR(255),
  bio TEXT,
  is_adult BOOLEAN DEFAULT FALSE,
  adult_verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- ============================================================================
-- 2. mate_posts — Travel companion posts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.mate_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  region VARCHAR(255),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  recruitment_count INTEGER NOT NULL CHECK (recruitment_count > 0),
  description TEXT,
  status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'FULL')),
  author_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

-- ============================================================================
-- 3. participation_requests — Requests to join mate posts
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.participation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mate_post_id UUID NOT NULL,
  requester_id UUID NOT NULL,
  message TEXT CHECK (LENGTH(message) <= 500),
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (mate_post_id) REFERENCES public.mate_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  UNIQUE (mate_post_id, requester_id)
);

-- ============================================================================
-- 4. blocks — User blocking relationships
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  blocked_user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  UNIQUE (user_id, blocked_user_id),
  CHECK (user_id != blocked_user_id)
);

-- ============================================================================
-- 5. reports — User reports and moderation
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_type VARCHAR(50) NOT NULL CHECK (target_type IN ('mate_post', 'profile', 'participation_request')),
  target_id UUID NOT NULL,
  reporter_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'REVIEWING', 'RESOLVED', 'DISMISSED')),
  resolution_reason TEXT,
  assigned_to UUID,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ============================================================================
-- 6. external_urls — External service URLs (flights, hotels, SNS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.external_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(50) NOT NULL UNIQUE CHECK (key IN ('flight', 'hotel', 'sns')),
  url TEXT NOT NULL,
  updated_by UUID,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- mate_posts indexes
CREATE INDEX IF NOT EXISTS idx_mate_posts_author_id ON public.mate_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_mate_posts_country ON public.mate_posts(country);
CREATE INDEX IF NOT EXISTS idx_mate_posts_status ON public.mate_posts(status);
CREATE INDEX IF NOT EXISTS idx_mate_posts_start_date ON public.mate_posts(start_date);

-- participation_requests indexes
CREATE INDEX IF NOT EXISTS idx_participation_requests_mate_post_id ON public.participation_requests(mate_post_id);
CREATE INDEX IF NOT EXISTS idx_participation_requests_requester_id ON public.participation_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_participation_requests_status ON public.participation_requests(status);

-- blocks indexes
CREATE INDEX IF NOT EXISTS idx_blocks_user_id ON public.blocks(user_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked_user_id ON public.blocks(blocked_user_id);

-- reports indexes
CREATE INDEX IF NOT EXISTS idx_reports_target_type_id ON public.reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);

-- ============================================================================
-- Updated At Triggers
-- ============================================================================

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mate_posts_updated_at
  BEFORE UPDATE ON public.mate_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participation_requests_updated_at
  BEFORE UPDATE ON public.participation_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_external_urls_updated_at
  BEFORE UPDATE ON public.external_urls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Grant default permissions (RLS policies will be set in DB-RLS-BASE)
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated, anon;
