import { useCallback } from 'react';
import { supabase } from './supabase';

export function useResumeDownload() {
  return useCallback(async () => {
    try {
      await supabase.from('resume_downloads').insert({
        referrer: typeof document !== 'undefined' ? document.referrer || null : null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent || null : null,
      });
    } catch {
      // Analytics is best-effort; never block the download.
    }

    const link = document.createElement('a');
    link.href = '/Shashidharan_V_Resume.pdf';
    link.download = 'Shashidharan_V_Resume.pdf';
    link.click();
  }, []);
}
