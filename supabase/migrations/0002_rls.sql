-- ============================================================================
-- Free Traveler Row Level Security (RLS) Policies
-- ============================================================================

-- ============================================================================
-- Admin Helper Function
-- ============================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user has admin role (can be extended with claims later)
  RETURN (auth.jwt() ->> 'role') = 'authenticated' AND
         EXISTS (
           SELECT 1 FROM public.profiles
           WHERE id = auth.uid() AND style LIKE '%admin%'
         );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 1. profiles — RLS Policies
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can view public fields of all profiles
CREATE POLICY "profiles_select_all" ON public.profiles
  FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can only delete their own profile
CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE
  USING (auth.uid() = id);

-- New users can insert their own profile
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 2. mate_posts — RLS Policies
-- ============================================================================

ALTER TABLE public.mate_posts ENABLE ROW LEVEL SECURITY;

-- Everyone can view mate posts (public)
CREATE POLICY "mate_posts_select_all" ON public.mate_posts
  FOR SELECT
  USING (true);

-- Only author can insert
CREATE POLICY "mate_posts_insert_own" ON public.mate_posts
  FOR INSERT
  WITH CHECK (auth.uid() = author_id);

-- Only author can update their posts
CREATE POLICY "mate_posts_update_own" ON public.mate_posts
  FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Only author can delete their posts
CREATE POLICY "mate_posts_delete_own" ON public.mate_posts
  FOR DELETE
  USING (auth.uid() = author_id);

-- ============================================================================
-- 3. participation_requests — RLS Policies
-- ============================================================================

ALTER TABLE public.participation_requests ENABLE ROW LEVEL SECURITY;

-- Only requester and post author can view participation requests
CREATE POLICY "participation_requests_select_own" ON public.participation_requests
  FOR SELECT
  USING (
    auth.uid() = requester_id OR
    auth.uid() = (SELECT author_id FROM public.mate_posts WHERE id = mate_post_id)
  );

-- Only requester can insert
CREATE POLICY "participation_requests_insert_own" ON public.participation_requests
  FOR INSERT
  WITH CHECK (auth.uid() = requester_id);

-- Only post author can update status
CREATE POLICY "participation_requests_update_author" ON public.participation_requests
  FOR UPDATE
  USING (auth.uid() = (SELECT author_id FROM public.mate_posts WHERE id = mate_post_id))
  WITH CHECK (auth.uid() = (SELECT author_id FROM public.mate_posts WHERE id = mate_post_id));

-- Only requester or post author can delete
CREATE POLICY "participation_requests_delete_own" ON public.participation_requests
  FOR DELETE
  USING (
    auth.uid() = requester_id OR
    auth.uid() = (SELECT author_id FROM public.mate_posts WHERE id = mate_post_id)
  );

-- ============================================================================
-- 4. blocks — RLS Policies
-- ============================================================================

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- Users can only view their own blocks
CREATE POLICY "blocks_select_own" ON public.blocks
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = blocked_user_id OR public.is_admin());

-- Users can only insert their own blocks
CREATE POLICY "blocks_insert_own" ON public.blocks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own blocks
CREATE POLICY "blocks_delete_own" ON public.blocks
  FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = blocked_user_id);

-- ============================================================================
-- 5. reports — RLS Policies
-- ============================================================================

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Users can view their own reports or if they are admin
CREATE POLICY "reports_select_own" ON public.reports
  FOR SELECT
  USING (auth.uid() = reporter_id OR public.is_admin());

-- Authenticated users can submit reports
CREATE POLICY "reports_insert_own" ON public.reports
  FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- Only admin or reporter can update reports
CREATE POLICY "reports_update_own" ON public.reports
  FOR UPDATE
  USING (auth.uid() = reporter_id OR public.is_admin())
  WITH CHECK (auth.uid() = reporter_id OR public.is_admin());

-- Only admin can delete reports
CREATE POLICY "reports_delete_admin" ON public.reports
  FOR DELETE
  USING (public.is_admin());

-- ============================================================================
-- 6. external_urls — RLS Policies (Server-side only)
-- ============================================================================

ALTER TABLE public.external_urls ENABLE ROW LEVEL SECURITY;

-- Disable all client access - external_urls must only be accessed server-side
CREATE POLICY "external_urls_select_none" ON public.external_urls
  FOR SELECT
  USING (false);

-- Only admin (through server API) can update
CREATE POLICY "external_urls_update_admin" ON public.external_urls
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admin (through server API) can insert
CREATE POLICY "external_urls_insert_admin" ON public.external_urls
  FOR INSERT
  WITH CHECK (public.is_admin());

-- ============================================================================
-- Grant Permissions
-- ============================================================================

-- Authenticated users can execute the is_admin function
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- Standard grants are already set in 0001_schema.sql
