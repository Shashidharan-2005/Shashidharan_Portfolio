import { useEffect, useState } from 'react';
import { supabase } from './supabase';

export type SiteSettings = {
  role: string;
  bio: string;
  location: string;
  profile_image: string;
};

const defaults: SiteSettings = {
  role: 'Data Analyst / Business Analytics',
  bio: 'BCA graduate with a bias for clean datasets, legible dashboards, and decisions that can be backed by evidence.',
  location: 'Bengaluru, Karnataka',
  profile_image: '',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const { data, error } = await supabase.from('site_settings').select('key, value');
      if (error || !active) {
        setLoading(false);
        return;
      }
      const map = new Map<string, string>();
      for (const row of data ?? []) map.set(row.key, row.value);
      setSettings({
        role: map.get('role') ?? defaults.role,
        bio: map.get('bio') ?? defaults.bio,
        location: map.get('location') ?? defaults.location,
        profile_image: map.get('profile_image') ?? defaults.profile_image,
      });
      setLoading(false);
    }

    load();
    return () => { active = false; };
  }, []);

  return { settings, loading };
}
