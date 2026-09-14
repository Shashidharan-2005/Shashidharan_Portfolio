/*
# Add resume download analytics and admin-managed profile settings

1. New Tables
- `resume_downloads`
  - `id` (uuid, primary key)
  - `created_at` (timestamp, download time)
  - `referrer` (text, referring page when available)
  - `user_agent` (text, browser identifier for aggregate analytics)
- `site_settings`
  - `key` (text, primary key, setting identifier)
  - `value` (text, editable setting content)
  - `updated_at` (timestamp, last edit time)

2. Security
- Row Level Security is enabled on both tables.
- Anyone can record a resume download event, but only the owner email can read, update, or delete analytics.
- Public visitors can read profile settings needed by the portfolio.
- Only the owner email can create, update, or delete profile settings.
- Admin access is tied to the authenticated email in the JWT and not to a client-provided role or hidden frontend route.

3. Important Notes
- Resume download events intentionally contain only aggregate browser context; no account or personal identity is collected.
- The fixed owner email matches the email displayed on the resume: shashidharan2005@gmail.com.
*/

CREATE TABLE IF NOT EXISTS public.resume_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  referrer text,
  user_agent text
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.resume_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can record resume downloads" ON public.resume_downloads;
CREATE POLICY "Public can record resume downloads"
ON public.resume_downloads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Owner can read resume analytics" ON public.resume_downloads;
CREATE POLICY "Owner can read resume analytics"
ON public.resume_downloads FOR SELECT
TO authenticated
USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

DROP POLICY IF EXISTS "Owner can update resume analytics" ON public.resume_downloads;
CREATE POLICY "Owner can update resume analytics"
ON public.resume_downloads FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

DROP POLICY IF EXISTS "Owner can delete resume analytics" ON public.resume_downloads;
CREATE POLICY "Owner can delete resume analytics"
ON public.resume_downloads FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Public can read site settings"
ON public.site_settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Owner can insert site settings" ON public.site_settings;
CREATE POLICY "Owner can insert site settings"
ON public.site_settings FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

DROP POLICY IF EXISTS "Owner can update site settings" ON public.site_settings;
CREATE POLICY "Owner can update site settings"
ON public.site_settings FOR UPDATE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com')
WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

DROP POLICY IF EXISTS "Owner can delete site settings" ON public.site_settings;
CREATE POLICY "Owner can delete site settings"
ON public.site_settings FOR DELETE
TO authenticated
USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

INSERT INTO public.site_settings (key, value)
VALUES
  ('role', 'Data Analyst / Business Analytics'),
  ('bio', 'BCA graduate with a bias for clean datasets, legible dashboards, and decisions that can be backed by evidence.'),
  ('location', 'Bengaluru, Karnataka')
ON CONFLICT (key) DO NOTHING;

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT INSERT ON public.resume_downloads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.resume_downloads TO authenticated;