-- Supabase Seed Data for Free Traveler
-- Development and testing seed data
-- NOTE: Test passwords are for local/test environment only

-- Test user accounts (created in auth.users first)
-- These IDs would normally be created by auth system
-- For seed purposes, we insert into profiles with fixed UUIDs

-- Insert test profiles
INSERT INTO public.profiles (id, nickname, age_group, gender, style, bio, is_adult, adult_verified_at, created_at, updated_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'TestUser1', '20s', 'M', 'adventure', 'I love hiking and outdoor activities', true, now(), now(), now()),
  ('550e8400-e29b-41d4-a716-446655440002', 'PostAuthor1', '30s', 'F', 'culture,food', 'Tour guide and food blogger', true, now(), now(), now()),
  ('550e8400-e29b-41d4-a716-446655440003', 'AdminUser', '40s', 'M', 'admin', 'Administrator account', true, now(), now(), now()),
  ('550e8400-e29b-41d4-a716-446655440004', 'TestUser2', '20s', 'F', 'relaxation', 'Beach and resort enthusiast', true, now(), now(), now());

-- Insert test mate posts
INSERT INTO public.mate_posts (id, title, country, region, start_date, end_date, recruitment_count, description, status, author_id, created_at, updated_at) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 'Seoul City Tour', '대한민국', '서울', '2026-10-15', '2026-10-20', 2, 'Looking for 2 people to join our Seoul trip. We plan to visit Myeongdong, Gangnam, and Dongdaemun. Have fun exploring Korean culture!', 'OPEN', '550e8400-e29b-41d4-a716-446655440002', now(), now()),
  ('650e8400-e29b-41d4-a716-446655440002', 'Jeju Island Hiking', '대한민국', '제주도', '2026-11-01', '2026-11-05', 3, 'Hiking adventure at Hallasan and exploring coastal trails. Looking for experienced hikers.', 'OPEN', '550e8400-e29b-41d4-a716-446655440002', now(), now()),
  ('650e8400-e29b-41d4-a716-446655440003', 'Japan Trip - Kyoto Focus', '일본', '교토', '2026-12-10', '2026-12-25', 4, 'Traditional temple tours and local cuisine. Great opportunity to learn about Japanese culture.', 'OPEN', '550e8400-e29b-41d4-a716-446655440002', now(), now());

-- Insert test participation requests
INSERT INTO public.participation_requests (id, mate_post_id, requester_id, message, status, created_at, updated_at) VALUES
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Hi! I am interested in joining your Seoul tour. I have free time in October.', 'PENDING', now(), now()),
  ('750e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440004', 'Sounds great! Can we visit shopping districts?', 'ACCEPTED', now(), now()),
  ('750e8400-e29b-41d4-a716-446655440003', '650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'I want to join the Jeju hiking trip!', 'PENDING', now(), now());

-- Insert test blocks
INSERT INTO public.blocks (id, user_id, blocked_user_id, created_at) VALUES
  ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', now());

-- Insert test reports
INSERT INTO public.reports (id, target_type, target_id, reporter_id, reason, status, resolution_reason, assigned_to, resolved_at, created_at, updated_at) VALUES
  ('950e8400-e29b-41d4-a716-446655440001', 'mate_post', '650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Spam post', 'OPEN', NULL, NULL, NULL, now(), now()),
  ('950e8400-e29b-41d4-a716-446655440002', 'profile', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Inappropriate profile content', 'REVIEWING', NULL, '550e8400-e29b-41d4-a716-446655440003', NULL, now(), now());

-- Insert external URLs
INSERT INTO public.external_urls (id, key, url, updated_by, updated_at) VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', 'flight', 'https://www.airline-example.com', '550e8400-e29b-41d4-a716-446655440003', now()),
  ('a50e8400-e29b-41d4-a716-446655440002', 'hotel', 'https://www.hotel-booking-example.com', '550e8400-e29b-41d4-a716-446655440003', now()),
  ('a50e8400-e29b-41d4-a716-446655440003', 'sns', 'https://www.instagram.com/free-traveler', '550e8400-e29b-41d4-a716-446655440003', now());

-- Verify seed data was inserted
SELECT COUNT(*) as profile_count FROM public.profiles;
SELECT COUNT(*) as post_count FROM public.mate_posts;
SELECT COUNT(*) as request_count FROM public.participation_requests;
SELECT COUNT(*) as block_count FROM public.blocks;
SELECT COUNT(*) as report_count FROM public.reports;
SELECT COUNT(*) as url_count FROM public.external_urls;
