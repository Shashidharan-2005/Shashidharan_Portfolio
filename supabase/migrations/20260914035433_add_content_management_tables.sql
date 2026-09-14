/*
# Add content management tables for projects, experiences, certifications, publications

1. New Tables
- `projects` — id, title, date, description, tags, sort_order, created_at
- `project_images` — id, project_id (FK), image_url, sort_order
- `project_pdfs` — id, project_id (FK), pdf_url, label, sort_order
- `experiences` — id, role, company, location, start_date, end_date, bullets (text[]), sort_order, created_at
- `certifications` — id, title, issuer, year, sort_order, created_at
- `publications` — id, title, journal, year, description, sort_order, created_at
- `introduction_content` — id, section_key (unique), heading, body (text[]), sort_order

2. Security
- RLS enabled on all tables.
- Public (anon, authenticated) can SELECT all content.
- Only the owner email can INSERT, UPDATE, DELETE.

3. Storage
- Creates a public storage bucket 'project-assets' for project images and PDFs.

4. Seed Data
- Seeds all tables with current content. Introduction uses new long-form text.
- Experience and project bullets rewritten in Google XYZ format.
*/

CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  tags text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read projects" ON public.projects;
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Owner can insert projects" ON public.projects;
CREATE POLICY "Owner can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can update projects" ON public.projects;
CREATE POLICY "Owner can update projects" ON public.projects FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com') WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can delete projects" ON public.projects;
CREATE POLICY "Owner can delete projects" ON public.projects FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

CREATE TABLE IF NOT EXISTS public.project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read project images" ON public.project_images;
CREATE POLICY "Public can read project images" ON public.project_images FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Owner can insert project images" ON public.project_images;
CREATE POLICY "Owner can insert project images" ON public.project_images FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can update project images" ON public.project_images;
CREATE POLICY "Owner can update project images" ON public.project_images FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com') WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can delete project images" ON public.project_images;
CREATE POLICY "Owner can delete project images" ON public.project_images FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

CREATE TABLE IF NOT EXISTS public.project_pdfs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  pdf_url text NOT NULL,
  label text NOT NULL DEFAULT 'Document',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.project_pdfs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read project PDFs" ON public.project_pdfs;
CREATE POLICY "Public can read project PDFs" ON public.project_pdfs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Owner can insert project PDFs" ON public.project_pdfs;
CREATE POLICY "Owner can insert project PDFs" ON public.project_pdfs FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can update project PDFs" ON public.project_pdfs;
CREATE POLICY "Owner can update project PDFs" ON public.project_pdfs FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com') WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can delete project PDFs" ON public.project_pdfs;
CREATE POLICY "Owner can delete project PDFs" ON public.project_pdfs FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

CREATE TABLE IF NOT EXISTS public.experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL,
  company text NOT NULL,
  location text NOT NULL DEFAULT '',
  start_date text NOT NULL DEFAULT '',
  end_date text NOT NULL DEFAULT '',
  bullets text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read experiences" ON public.experiences;
CREATE POLICY "Public can read experiences" ON public.experiences FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Owner can insert experiences" ON public.experiences;
CREATE POLICY "Owner can insert experiences" ON public.experiences FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can update experiences" ON public.experiences;
CREATE POLICY "Owner can update experiences" ON public.experiences FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com') WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can delete experiences" ON public.experiences;
CREATE POLICY "Owner can delete experiences" ON public.experiences FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

CREATE TABLE IF NOT EXISTS public.certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read certifications" ON public.certifications;
CREATE POLICY "Public can read certifications" ON public.certifications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Owner can insert certifications" ON public.certifications;
CREATE POLICY "Owner can insert certifications" ON public.certifications FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can update certifications" ON public.certifications;
CREATE POLICY "Owner can update certifications" ON public.certifications FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com') WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can delete certifications" ON public.certifications;
CREATE POLICY "Owner can delete certifications" ON public.certifications FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

CREATE TABLE IF NOT EXISTS public.publications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  journal text NOT NULL DEFAULT '',
  year text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read publications" ON public.publications;
CREATE POLICY "Public can read publications" ON public.publications FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Owner can insert publications" ON public.publications;
CREATE POLICY "Owner can insert publications" ON public.publications FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can update publications" ON public.publications;
CREATE POLICY "Owner can update publications" ON public.publications FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com') WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can delete publications" ON public.publications;
CREATE POLICY "Owner can delete publications" ON public.publications FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

CREATE TABLE IF NOT EXISTS public.introduction_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL UNIQUE,
  heading text NOT NULL DEFAULT '',
  body text[] NOT NULL DEFAULT '{}',
  sort_order integer NOT NULL DEFAULT 0
);
ALTER TABLE public.introduction_content ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read introduction" ON public.introduction_content;
CREATE POLICY "Public can read introduction" ON public.introduction_content FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "Owner can insert introduction" ON public.introduction_content;
CREATE POLICY "Owner can insert introduction" ON public.introduction_content FOR INSERT TO authenticated WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can update introduction" ON public.introduction_content;
CREATE POLICY "Owner can update introduction" ON public.introduction_content FOR UPDATE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com') WITH CHECK ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can delete introduction" ON public.introduction_content;
CREATE POLICY "Owner can delete introduction" ON public.introduction_content FOR DELETE TO authenticated USING ((auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');

GRANT SELECT ON public.projects TO anon, authenticated;
GRANT SELECT ON public.project_images TO anon, authenticated;
GRANT SELECT ON public.project_pdfs TO anon, authenticated;
GRANT SELECT ON public.experiences TO anon, authenticated;
GRANT SELECT ON public.certifications TO anon, authenticated;
GRANT SELECT ON public.publications TO anon, authenticated;
GRANT SELECT ON public.introduction_content TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.project_images TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.project_pdfs TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.experiences TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.certifications TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.publications TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.introduction_content TO authenticated;

INSERT INTO public.introduction_content (section_key, heading, body, sort_order) VALUES
('story', 'I don''t just look at data. I look for the story behind it.', ARRAY[
  'I''m a Data Analytics enthusiast who enjoys turning messy, real-world data into something clear, meaningful, and useful.',
  'What pulled me toward analytics was never just the tools. It was the curiosity.',
  'A number changes — why?',
  'A trend appears — what caused it?',
  'A business problem shows up — what does the data tell us about it?',
  'I enjoy asking those questions, digging through the data, finding patterns, and turning them into insights that can actually support better decisions.'
], 0),
('internship', 'During my Data Analytics internship at Anudip Foundation', ARRAY[
  'I worked with multi-source datasets using SQL, Python, Excel and Power BI — cleaning and validating data, exploring trends and anomalies, building dashboards, and working on recurring reporting.',
  'That experience showed me that meaningful analysis starts well before the dashboard. It starts with understanding the problem.'
], 1),
('projects_mindset', 'I''ve continued building that mindset through projects.', ARRAY[
  'From analyzing 100K+ ride-booking records to building applications that capture and work with real data, I like taking problems beyond theory and seeing what data can actually reveal.'
], 2),
('research', 'My curiosity also extends beyond analytics.', ARRAY[
  'I''ve co-authored research papers in Generative AI in Healthcare and AI-driven cybersecurity threat detection, which has strengthened the way I approach unfamiliar problems — research, question, experiment, learn, and improve.'
], 3),
('working_towards', 'What I''m working towards', ARRAY[
  'I''m building myself into an analyst who can sit between data and business — someone who can understand the question, work with the data, communicate the insight, and think about what should happen next.',
  'I''m still learning, and that''s something I value. I don''t believe becoming good at analytics means knowing every tool. It means being curious enough to keep learning, disciplined enough to validate your thinking, and practical enough to turn analysis into something useful.',
  'I''m currently looking for opportunities where I can work on real problems, learn from experienced people, take ownership, and create measurable value through data.',
  'If there''s a problem worth understanding, I''m interested in finding what the data has to say.'
], 4)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO public.experiences (role, company, location, start_date, end_date, bullets, sort_order) VALUES
('Data Analytics Intern', 'Anudip Foundation', 'Bengaluru', 'FEB 2026', 'JUN 2026', ARRAY[
  'Improved reporting accuracy across multi-source datasets by validating and analyzing 10,000+ rows using SQL and Python, as measured by a reduction in data quality issues flagged by the reporting team.',
  'Identified previously unseen trends and anomalies through exploratory data analysis (EDA), as measured by the number of actionable insights adopted by cross-functional teams for business decision-making.',
  'Reduced manual reporting effort by building automated Power BI dashboards and recurring reporting workflows using Power Query and DAX, as measured by the hours saved per reporting cycle.',
  'Bridged the gap between technical analysis and business strategy by presenting data-driven insights to cross-functional teams, as measured by the number of recommendations translated into action items.'
], 0)
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (title, date, description, tags, sort_order) VALUES
('Rapido Ride Analytics Dashboard', 'MAY 2026', 'Analyzed a 100K+ record, multi-source ride-booking dataset to identify booking trends and peak-hour demand patterns, as measured by the clarity of actionable insights delivered, by performing exploratory data analysis in Python and building an interactive Power BI dashboard using DAX and Git for version control.', 'Python · EDA · Power BI · DAX · Git', 0),
('Smart Attendance Management System (SAMS)', 'MAY 2026', 'Reduced manual attendance tracking effort by automating attendance-related data processing, as measured by the time saved per attendance cycle, by building a Python + FastAPI application backed by SQLite and validating it with a 20-user pilot group.', 'Python · FastAPI · SQLite', 1)
ON CONFLICT DO NOTHING;

INSERT INTO public.certifications (title, issuer, year, sort_order) VALUES
('Data Analytics Essentials', 'Cisco', '2026', 0),
('Business Analytics with Excel', 'Simplilearn', '2025', 1),
('Data Analytics Job Simulation', 'Deloitte — Forage', '2025', 2),
('Data Science', 'Infosys', '2025', 3),
('Data Science & Analytics', 'HP LIFE', '2025', 4),
('AI Essentials', 'Google', '2025', 5)
ON CONFLICT DO NOTHING;

INSERT INTO public.publications (title, journal, year, description, sort_order) VALUES
('Generative AI in Healthcare: Bridging Clinical Innovation and Organizational Efficiency', 'IJIRT', '2025', 'Co-authored a literature review synthesizing 130+ sources on Generative AI applications in healthcare.', 0),
('AI-Driven Cybersecurity Threat Detection', 'IJIRT', '2025', 'Co-authored research on AI-driven approaches to cybersecurity threat detection.', 1)
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('project-assets', 'project-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can read project-assets" ON storage.objects;
CREATE POLICY "Public can read project-assets" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'project-assets');
DROP POLICY IF EXISTS "Owner can upload project-assets" ON storage.objects;
CREATE POLICY "Owner can upload project-assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-assets' AND (auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can update project-assets" ON storage.objects;
CREATE POLICY "Owner can update project-assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-assets' AND (auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com') WITH CHECK (bucket_id = 'project-assets' AND (auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
DROP POLICY IF EXISTS "Owner can delete project-assets" ON storage.objects;
CREATE POLICY "Owner can delete project-assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-assets' AND (auth.jwt() ->> 'email') = 'shashidharan2005@gmail.com');
