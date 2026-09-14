/*
# Tighten anon grants on resume_downloads and site_settings

1. Changes
- Revoke UPDATE and DELETE from anon on resume_downloads (anon only needs INSERT to record downloads)
- Revoke INSERT, UPDATE, and DELETE from anon on site_settings (anon only needs SELECT to read public settings)
2. Security
- Policies already restrict access correctly, but grants were broader than needed.
- This narrows grants to match the minimum each role needs.
- authenticated retains full privileges on both tables (governed by owner-email policies).
3. Notes
- No data is lost; only privilege grants change.
- The app continues to function: anon can still insert download records and read settings.
*/

REVOKE UPDATE, DELETE ON public.resume_downloads FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.site_settings FROM anon;
