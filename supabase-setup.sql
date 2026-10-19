-- GEMA Website Database Schema
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Members
CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  business_name text,
  phone text,
  email text,
  address text,
  member_since text,
  created_at timestamptz DEFAULT now()
);

-- Executive Committee
CREATE TABLE executive_committee (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  designation text NOT NULL,
  phone text,
  photo_url text,
  display_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Price Lists
CREATE TABLE price_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  date_label text NOT NULL,
  pdf_url text NOT NULL,
  is_paid_listing boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Circulars
CREATE TABLE circulars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date text NOT NULL,
  type text NOT NULL,
  pdf_url text,
  created_at timestamptz DEFAULT now()
);

-- Announcements
CREATE TABLE announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  badge text NOT NULL DEFAULT 'NEW',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Banner Ads
CREATE TABLE banner_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  link_url text,
  position text DEFAULT 'top',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Events
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date_range text NOT NULL,
  venue text,
  status text DEFAULT 'Upcoming',
  event_type text NOT NULL DEFAULT 'exhibition',
  photo_gallery_url text,
  created_at timestamptz DEFAULT now()
);

-- GEMA Diary
CREATE TABLE gema_diary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  pdf_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE executive_committee ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE circulars ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE gema_diary ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables (anyone can view the site)
CREATE POLICY "Public read" ON members FOR SELECT USING (true);
CREATE POLICY "Public read" ON executive_committee FOR SELECT USING (true);
CREATE POLICY "Public read" ON price_lists FOR SELECT USING (true);
CREATE POLICY "Public read" ON circulars FOR SELECT USING (true);
CREATE POLICY "Public read" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read" ON banner_ads FOR SELECT USING (true);
CREATE POLICY "Public read" ON events FOR SELECT USING (true);
CREATE POLICY "Public read" ON gema_diary FOR SELECT USING (true);

-- Admin write access (only authenticated users can modify)
CREATE POLICY "Admin insert" ON members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON members FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON members FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON executive_committee FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON executive_committee FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON executive_committee FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON price_lists FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON price_lists FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON price_lists FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON circulars FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON circulars FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON circulars FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON announcements FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON announcements FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON announcements FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON banner_ads FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON banner_ads FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON banner_ads FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON events FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin insert" ON gema_diary FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admin update" ON gema_diary FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON gema_diary FOR DELETE USING (auth.role() = 'authenticated');

-- Create storage bucket for PDFs and images
INSERT INTO storage.buckets (id, name, public) VALUES ('gema-files', 'gema-files', true);

-- Public read access for storage
CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'gema-files');
CREATE POLICY "Admin upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gema-files' AND auth.role() = 'authenticated');
CREATE POLICY "Admin delete" ON storage.objects FOR DELETE USING (bucket_id = 'gema-files' AND auth.role() = 'authenticated');

-- Seed sample data
INSERT INTO announcements (title, description, badge) VALUES
  ('Updated price lists for Q4 2025 now available', 'Download the latest price lists for all major brands.', 'NEW'),
  ('GEMA Annual Exhibition 2025', 'Join us for the annual electrical trade exhibition in Guwahati.', 'EVENT'),
  ('New membership applications now open', 'Electrical business owners in Guwahati can apply for GEMA membership.', 'INFO');

INSERT INTO price_lists (brand, date_label, pdf_url) VALUES
  ('Finolex', 'Oct 2025', ''), ('Finolex', 'Aug 2025', ''), ('Finolex', 'Jun 2025', ''), ('Finolex', 'Apr 2025', ''),
  ('Havells', 'Oct 2025', ''), ('Havells', 'Aug 2025', ''), ('Havells', 'Jun 2025', ''), ('Havells', 'Apr 2025', ''),
  ('Polycab', 'Oct 2025', ''), ('Polycab', 'Sep 2025', ''), ('Polycab', 'Jul 2025', ''), ('Polycab', 'May 2025', ''),
  ('RR Kabel', 'Oct 2025', ''), ('RR Kabel', 'Aug 2025', ''), ('RR Kabel', 'Jun 2025', ''),
  ('KEI', 'Oct 2025', ''), ('KEI', 'Aug 2025', ''), ('KEI', 'Jun 2025', ''), ('KEI', 'Apr 2025', ''),
  ('Plaza Wires', 'Oct 2025', ''), ('Plaza Wires', 'Aug 2025', '');

INSERT INTO circulars (title, date, type) VALUES
  ('Annual General Meeting Notice 2025', 'Oct 15, 2025', 'Meeting'),
  ('Revised Membership Fee Structure', 'Sep 20, 2025', 'Membership'),
  ('Exhibition 2025 Participation Guidelines', 'Aug 10, 2025', 'Event'),
  ('Market Holiday Calendar 2025 to 2026', 'Jul 01, 2025', 'General'),
  ('Election Schedule Announcement', 'Jun 15, 2025', 'Election');

INSERT INTO events (title, description, date_range, venue, status, event_type) VALUES
  ('GEMA Electrical Trade Exhibition 2025', 'The biggest electrical trade exhibition in Northeast India featuring 100+ brands and manufacturers.', 'November 15 to 17, 2025', 'Guwahati Trade Fair Complex', 'Upcoming', 'exhibition'),
  ('GEMA Electrical Trade Exhibition 2023', 'Successfully hosted with 80+ exhibitors and over 5,000 visitors from across Assam and the Northeast.', 'December 8 to 10, 2023', 'Guwahati Trade Fair Complex', 'Completed', 'exhibition');
