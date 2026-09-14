import { useCallback, useEffect, useState } from 'react';
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  Briefcase,
  Clock,
  Download,
  FileText,
  FolderKanban,
  Globe,
  Image as ImageIcon,
  LogOut,
  Monitor,
  Plus,
  Save,
  Settings as SettingsIcon,
  Trash2,
  User,
  Upload,
  FileEdit,
} from 'lucide-react';
import { supabase, OWNER_EMAIL } from './lib/supabase';

type DownloadRow = { id: string; created_at: string; referrer: string | null; user_agent: string | null };
type SettingsMap = { role: string; bio: string; location: string; profile_image: string };
type AdminView = 'dashboard' | 'analytics' | 'settings' | 'projects' | 'experience' | 'certifications' | 'publications' | 'introduction';

const defaultSettings: SettingsMap = {
  role: 'Data Analyst / Business Analytics',
  bio: 'BCA graduate with a bias for clean datasets, legible dashboards, and decisions that can be backed by evidence.',
  location: 'Bengaluru, Karnataka',
  profile_image: '',
};

export default function AdminPanel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<boolean | null>(null);
  const [view, setView] = useState<AdminView>('dashboard');
  const [downloads, setDownloads] = useState<DownloadRow[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [settings, setSettings] = useState<SettingsMap>(defaultSettings);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [uploadingImg, setUploadingImg] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(!!data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => setSession(!!sess));
    return () => listener.subscription.unsubscribe();
  }, []);

  const loadAnalytics = useCallback(async () => {
    setLoadingData(true);
    const { data, error } = await supabase.from('resume_downloads').select('*').order('created_at', { ascending: false });
    if (!error && data) setDownloads(data as DownloadRow[]);
    setLoadingData(false);
  }, []);

  const loadSettings = useCallback(async () => {
    setSettingsLoading(true);
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (!error && data) {
      const map = new Map<string, string>();
      for (const row of data) map.set(row.key, row.value);
      setSettings({ role: map.get('role') ?? defaultSettings.role, bio: map.get('bio') ?? defaultSettings.bio, location: map.get('location') ?? defaultSettings.location, profile_image: map.get('profile_image') ?? defaultSettings.profile_image });
    }
    setSettingsLoading(false);
  }, []);

  useEffect(() => {
    if (session) { loadAnalytics(); loadSettings(); }
  }, [session, loadAnalytics, loadSettings]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) setAuthError('Invalid credentials. Access is restricted to the site owner.');
  }

  async function handleLogout() { await supabase.auth.signOut(); setView('dashboard'); }

  async function saveSettings() {
    setSaving(true); setSaveMsg('');
    const updates = Object.entries(settings).map(([key, value]) =>
      supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
    );
    await Promise.all(updates);
    setSaving(false);
    setSaveMsg('Settings saved. Changes are live on your portfolio.');
    setTimeout(() => setSaveMsg(''), 4000);
  }

  async function deleteDownload(id: string) {
    await supabase.from('resume_downloads').delete().eq('id', id);
    setDownloads((prev) => prev.filter((d) => d.id !== id));
  }

  async function clearAllAnalytics() {
    await supabase.from('resume_downloads').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setDownloads([]);
  }

  if (session === null) return <div className="admin-shell"><div className="admin-loading">Verifying session...</div></div>;

  if (!session) {
    return (
      <div className="admin-shell">
        <form className="admin-login" onSubmit={handleLogin}>
          <div className="admin-login-header"><User size={22} /><span>admin access</span></div>
          <p className="admin-login-sub">Restricted area — site owner only.</p>
          <input type="email" placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
          <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
          {authError && <div className="admin-error">{authError}</div>}
          <button type="submit" disabled={submitting} className="admin-login-btn">{submitting ? 'authenticating...' : 'enter'}</button>
          <a href="/" className="admin-back-link">← back to portfolio</a>
        </form>
      </div>
    );
  }

  const totalDownloads = downloads.length;
  const today = new Date();
  const todayCount = downloads.filter((d) => new Date(d.created_at).toDateString() === today.toDateString()).length;
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const weekCount = downloads.filter((d) => new Date(d.created_at) >= weekAgo).length;
  const browserCounts = downloads.reduce<Record<string, number>>((acc, d) => {
    const ua = d.user_agent || 'unknown';
    let browser = 'other';
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
    else if (ua.includes('Edg')) browser = 'Edge';
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {});

  const tabs: Array<{ key: AdminView; label: string; icon: typeof BarChart3 }> = [
    { key: 'dashboard', label: 'dashboard', icon: BarChart3 },
    { key: 'analytics', label: 'download log', icon: Activity },
    { key: 'settings', label: 'profile', icon: SettingsIcon },
    { key: 'introduction', label: 'introduction', icon: FileEdit },
    { key: 'projects', label: 'projects', icon: FolderKanban },
    { key: 'experience', label: 'experience', icon: Briefcase },
    { key: 'certifications', label: 'certifications', icon: Award },
    { key: 'publications', label: 'publications', icon: FileText },
  ];

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header-left">
          <span className="admin-badge">ADMIN</span>
          <span className="admin-owner">{OWNER_EMAIL}</span>
        </div>
        <div className="admin-header-right">
          <a href="/" className="admin-nav-link"><ArrowLeft size={14} /> portfolio</a>
          <button onClick={handleLogout} className="admin-nav-link logout"><LogOut size={14} /> sign out</button>
        </div>
      </header>

      <nav className="admin-tabs">
        {tabs.map((tab) => (
          <button key={tab.key} className={view === tab.key ? 'active' : ''} onClick={() => setView(tab.key)}>
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </nav>

      <main className="admin-main">
        {view === 'dashboard' && (
          <div className="admin-dashboard">
            <div className="stat-row">
              <div className="stat-card"><Download size={18} /><strong>{totalDownloads}</strong><span>total downloads</span></div>
              <div className="stat-card"><Clock size={18} /><strong>{todayCount}</strong><span>today</span></div>
              <div className="stat-card"><Activity size={18} /><strong>{weekCount}</strong><span>this week</span></div>
            </div>
            <div className="stat-section">
              <h2>browser breakdown</h2>
              <div className="browser-bars">
                {Object.entries(browserCounts).sort((a, b) => b[1] - a[1]).map(([browser, count]) => (
                  <div className="browser-row" key={browser}>
                    <span className="browser-name"><Monitor size={14} /> {browser}</span>
                    <div className="browser-bar-track"><div className="browser-bar-fill" style={{ width: `${totalDownloads ? (count / totalDownloads) * 100 : 0}%` }} /></div>
                    <span className="browser-count">{count}</span>
                  </div>
                ))}
                {totalDownloads === 0 && <p className="empty-state">No downloads recorded yet.</p>}
              </div>
            </div>
          </div>
        )}

        {view === 'analytics' && (
          <div className="admin-analytics">
            <div className="analytics-header">
              <h2>download log</h2>
              {downloads.length > 0 && <button onClick={clearAllAnalytics} className="admin-danger-btn"><Trash2 size={14} /> clear all</button>}
            </div>
            {loadingData ? <p className="empty-state">Loading...</p> : downloads.length === 0 ? <p className="empty-state">No downloads recorded yet.</p> : (
              <div className="analytics-table-wrap">
                <table className="analytics-table">
                  <thead><tr><th>#</th><th>timestamp</th><th>referrer</th><th>browser / device</th><th></th></tr></thead>
                  <tbody>
                    {downloads.map((d, i) => {
                      const ua = d.user_agent || '';
                      let browser = 'unknown', os = 'unknown';
                      if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
                      else if (ua.includes('Firefox')) browser = 'Firefox';
                      else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
                      else if (ua.includes('Edg')) browser = 'Edge';
                      if (ua.includes('Windows')) os = 'Windows';
                      else if (ua.includes('Mac')) os = 'macOS';
                      else if (ua.includes('Android')) os = 'Android';
                      else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
                      else if (ua.includes('Linux')) os = 'Linux';
                      return (
                        <tr key={d.id}>
                          <td className="row-num">{i + 1}</td>
                          <td className="row-date">{new Date(d.created_at).toLocaleString()}</td>
                          <td className="row-referrer">{d.referrer ? <><Globe size={12} /> {d.referrer}</> : <span className="muted">direct</span>}</td>
                          <td className="row-ua">{browser} / {os}</td>
                          <td><button onClick={() => deleteDownload(d.id)} className="row-delete"><Trash2 size={13} /></button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {view === 'settings' && (
          <div className="admin-settings">
            <h2>edit profile</h2>
            <p className="settings-sub">Changes here update your profile picture, role, bio, and location shown on your portfolio in real time.</p>
            {settingsLoading ? <p className="empty-state">Loading...</p> : (
              <div className="settings-form">
                <div className="profile-image-section">
                  <span className="settings-label">profile picture</span>
                  <div className="profile-image-upload">
                    {settings.profile_image ? (
                      <img src={settings.profile_image} alt="profile" className="profile-image-preview" />
                    ) : (
                      <div className="profile-image-placeholder"><User size={32} /></div>
                    )}
                    <div className="profile-image-actions">
                      <label className="admin-upload-btn">
                        {uploadingImg ? 'uploading...' : <><Upload size={14} /> upload image</>}
                        <input type="file" accept="image/*" hidden onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setUploadingImg(true);
                          const path = `profile_${Date.now()}.${f.name.split('.').pop()}`;
                          const { error: upErr } = await supabase.storage.from('project-assets').upload(path, f, { upsert: true });
                          if (upErr) { setUploadingImg(false); return; }
                          const { data: urlData } = supabase.storage.from('project-assets').getPublicUrl(path);
                          setSettings({ ...settings, profile_image: urlData.publicUrl });
                          await supabase.from('site_settings').upsert({ key: 'profile_image', value: urlData.publicUrl, updated_at: new Date().toISOString() }, { onConflict: 'key' });
                          setUploadingImg(false);
                          e.target.value = '';
                        }} />
                      </label>
                      {settings.profile_image && (
                        <button onClick={async () => {
                          setSettings({ ...settings, profile_image: '' });
                          await supabase.from('site_settings').upsert({ key: 'profile_image', value: '', updated_at: new Date().toISOString() }, { onConflict: 'key' });
                        }} className="admin-danger-btn"><Trash2 size={14} /> remove</button>
                      )}
                    </div>
                  </div>
                </div>
                <label><span>role / title</span><input value={settings.role} onChange={(e) => setSettings({ ...settings, role: e.target.value })} /></label>
                <label><span>bio</span><textarea rows={4} value={settings.bio} onChange={(e) => setSettings({ ...settings, bio: e.target.value })} /></label>
                <label><span>location</span><input value={settings.location} onChange={(e) => setSettings({ ...settings, location: e.target.value })} /></label>
                <div className="settings-actions">
                  <button onClick={saveSettings} disabled={saving} className="admin-save-btn"><Save size={15} /> {saving ? 'saving...' : 'save changes'}</button>
                  {saveMsg && <span className="save-msg">{saveMsg}</span>}
                </div>
              </div>
            )}
          </div>
        )}

        {view === 'introduction' && <IntroductionAdmin />}
        {view === 'projects' && <ProjectsAdmin />}
        {view === 'experience' && <ExperienceAdmin />}
        {view === 'certifications' && <CertificationsAdmin />}
        {view === 'publications' && <PublicationsAdmin />}
      </main>
    </div>
  );
}

function IntroductionAdmin() {
  const [sections, setSections] = useState<Array<{ id: string; section_key: string; heading: string; body: string[]; sort_order: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('introduction_content').select('*').order('sort_order', { ascending: true });
    if (data) setSections(data as typeof sections);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    setSaving(true);
    for (const s of sections) {
      await supabase.from('introduction_content').upsert({ id: s.id, section_key: s.section_key, heading: s.heading, body: s.body, sort_order: s.sort_order }, { onConflict: 'section_key' });
    }
    setSaving(false);
  }

  async function add() {
    const { data } = await supabase.from('introduction_content').insert({ section_key: `section_${Date.now()}`, heading: 'New section', body: [''], sort_order: sections.length }).select().single();
    if (data) setSections([...sections, data as typeof sections[0]]);
  }

  async function remove(id: string) {
    await supabase.from('introduction_content').delete().eq('id', id);
    setSections(sections.filter((s) => s.id !== id));
  }

  if (loading) return <p className="empty-state">Loading...</p>;

  return (
    <div className="admin-section">
      <div className="admin-section-header"><h2>introduction sections</h2><button onClick={add} className="admin-add-btn"><Plus size={15} /> add section</button></div>
      {sections.map((s, si) => (
        <div className="admin-edit-card" key={s.id}>
          <div className="admin-edit-card-header">
            <span>section {si + 1}</span>
            <button onClick={() => remove(s.id)} className="row-delete"><Trash2 size={14} /></button>
          </div>
          <label><span>heading</span><input value={s.heading} onChange={(e) => setSections(sections.map((x) => x.id === s.id ? { ...x, heading: e.target.value } : x))} /></label>
          <label><span>body (one paragraph per line)</span>
            <textarea rows={6} value={s.body.join('\n')} onChange={(e) => setSections(sections.map((x) => x.id === s.id ? { ...x, body: e.target.value.split('\n') } : x))} />
          </label>
          <label><span>sort order</span><input type="number" value={s.sort_order} onChange={(e) => setSections(sections.map((x) => x.id === s.id ? { ...x, sort_order: parseInt(e.target.value) || 0 } : x))} /></label>
        </div>
      ))}
      <button onClick={save} disabled={saving} className="admin-save-btn"><Save size={15} /> {saving ? 'saving...' : 'save all'}</button>
    </div>
  );
}

function ProjectsAdmin() {
  const [projects, setProjects] = useState<Array<{ id: string; title: string; date: string; description: string; tags: string; sort_order: number }>>([]);
  const [images, setImages] = useState<Record<string, Array<{ id: string; image_url: string; sort_order: number }>>>({});
  const [pdfs, setPdfs] = useState<Record<string, Array<{ id: string; pdf_url: string; label: string; sort_order: number }>>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [{ data: projData }, { data: imgData }, { data: pdfData }] = await Promise.all([
      supabase.from('projects').select('*').order('sort_order', { ascending: true }),
      supabase.from('project_images').select('*').order('sort_order', { ascending: true }),
      supabase.from('project_pdfs').select('*').order('sort_order', { ascending: true }),
    ]);
    if (projData) setProjects(projData as typeof projects);
    const imgMap: typeof images = {};
    for (const img of (imgData ?? []) as Array<{ id: string; project_id: string; image_url: string; sort_order: number }>) {
      if (!imgMap[img.project_id]) imgMap[img.project_id] = [];
      imgMap[img.project_id].push({ id: img.id, image_url: img.image_url, sort_order: img.sort_order });
    }
    setImages(imgMap);
    const pdfMap: typeof pdfs = {};
    for (const pdf of (pdfData ?? []) as Array<{ id: string; project_id: string; pdf_url: string; label: string; sort_order: number }>) {
      if (!pdfMap[pdf.project_id]) pdfMap[pdf.project_id] = [];
      pdfMap[pdf.project_id].push({ id: pdf.id, pdf_url: pdf.pdf_url, label: pdf.label, sort_order: pdf.sort_order });
    }
    setPdfs(pdfMap);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add() {
    const { data } = await supabase.from('projects').insert({ title: 'New Project', date: '', description: '', tags: '', sort_order: projects.length }).select().single();
    if (data) { setProjects([...projects, data as typeof projects[0]]); }
  }

  async function remove(id: string) {
    await supabase.from('projects').delete().eq('id', id);
    setProjects(projects.filter((p) => p.id !== id));
  }

  async function save() {
    setSaving(true);
    for (const p of projects) {
      await supabase.from('projects').upsert({ id: p.id, title: p.title, date: p.date, description: p.description, tags: p.tags, sort_order: p.sort_order }, { onConflict: 'id' });
    }
    setSaving(false);
  }

  async function uploadImage(projectId: string, file: File) {
    setUploading(projectId);
    const ext = file.name.split('.').pop();
    const path = `${projectId}/${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('project-assets').upload(path, file, { upsert: true });
    if (upErr) { setUploading(null); return; }
    const { data: urlData } = supabase.storage.from('project-assets').getPublicUrl(path);
    const { data } = await supabase.from('project_images').insert({ project_id: projectId, image_url: urlData.publicUrl, sort_order: (images[projectId]?.length ?? 0) }).select().single();
    if (data) {
      const newImg = data as { id: string; image_url: string; sort_order: number };
      setImages({ ...images, [projectId]: [...(images[projectId] ?? []), newImg] });
    }
    setUploading(null);
  }

  async function deleteImage(projectId: string, imgId: string) {
    await supabase.from('project_images').delete().eq('id', imgId);
    setImages({ ...images, [projectId]: (images[projectId] ?? []).filter((i) => i.id !== imgId) });
  }

  async function addPdf(projectId: string, file: File) {
    setUploading(projectId);
    const ext = file.name.split('.').pop();
    const path = `${projectId}/pdf_${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('project-assets').upload(path, file, { upsert: true });
    if (upErr) { setUploading(null); return; }
    const { data: urlData } = supabase.storage.from('project-assets').getPublicUrl(path);
    const { data } = await supabase.from('project_pdfs').insert({ project_id: projectId, pdf_url: urlData.publicUrl, label: file.name, sort_order: (pdfs[projectId]?.length ?? 0) }).select().single();
    if (data) {
      const newPdf = data as { id: string; pdf_url: string; label: string; sort_order: number };
      setPdfs({ ...pdfs, [projectId]: [...(pdfs[projectId] ?? []), newPdf] });
    }
    setUploading(null);
  }

  async function deletePdf(projectId: string, pdfId: string) {
    await supabase.from('project_pdfs').delete().eq('id', pdfId);
    setPdfs({ ...pdfs, [projectId]: (pdfs[projectId] ?? []).filter((p) => p.id !== pdfId) });
  }

  if (loading) return <p className="empty-state">Loading...</p>;

  return (
    <div className="admin-section">
      <div className="admin-section-header"><h2>projects</h2><button onClick={add} className="admin-add-btn"><Plus size={15} /> add project</button></div>
      {projects.map((p, pi) => (
        <div className="admin-edit-card" key={p.id}>
          <div className="admin-edit-card-header"><span>project {pi + 1}</span><button onClick={() => remove(p.id)} className="row-delete"><Trash2 size={14} /></button></div>
          <label><span>title</span><input value={p.title} onChange={(e) => setProjects(projects.map((x) => x.id === p.id ? { ...x, title: e.target.value } : x))} /></label>
          <label><span>date</span><input value={p.date} onChange={(e) => setProjects(projects.map((x) => x.id === p.id ? { ...x, date: e.target.value } : x))} /></label>
          <label><span>description (Google XYZ format recommended)</span><textarea rows={4} value={p.description} onChange={(e) => setProjects(projects.map((x) => x.id === p.id ? { ...x, description: e.target.value } : x))} /></label>
          <label><span>tags</span><input value={p.tags} onChange={(e) => setProjects(projects.map((x) => x.id === p.id ? { ...x, tags: e.target.value } : x))} /></label>
          <label><span>sort order</span><input type="number" value={p.sort_order} onChange={(e) => setProjects(projects.map((x) => x.id === p.id ? { ...x, sort_order: parseInt(e.target.value) || 0 } : x))} /></label>

          <div className="admin-assets">
            <div className="admin-assets-section">
              <span className="admin-assets-label"><ImageIcon size={14} /> project images (slideshow)</span>
              <div className="admin-image-grid">
                {(images[p.id] ?? []).map((img) => (
                  <div className="admin-image-thumb" key={img.id}>
                    <img src={img.image_url} alt="" />
                    <button onClick={() => deleteImage(p.id, img.id)} className="admin-asset-delete"><Trash2 size={12} /></button>
                  </div>
                ))}
                <label className="admin-upload-btn">
                  {uploading === p.id ? 'uploading...' : <><Upload size={14} /> add image</>}
                  <input type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(p.id, f); e.target.value = ''; }} />
                </label>
              </div>
            </div>
            <div className="admin-assets-section">
              <span className="admin-assets-label"><FileText size={14} /> project PDFs</span>
              <div className="admin-pdf-list">
                {(pdfs[p.id] ?? []).map((pdf) => (
                  <div className="admin-pdf-item" key={pdf.id}>
                    <a href={pdf.pdf_url} target="_blank" rel="noreferrer"><FileText size={13} /> {pdf.label}</a>
                    <button onClick={() => deletePdf(p.id, pdf.id)} className="admin-asset-delete"><Trash2 size={12} /></button>
                  </div>
                ))}
                <label className="admin-upload-btn">
                  <Upload size={14} /> add PDF
                  <input type="file" accept="application/pdf" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) addPdf(p.id, f); e.target.value = ''; }} />
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button onClick={save} disabled={saving} className="admin-save-btn"><Save size={15} /> {saving ? 'saving...' : 'save all'}</button>
    </div>
  );
}

function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<Array<{ id: string; role: string; company: string; location: string; start_date: string; end_date: string; bullets: string[]; sort_order: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true });
    if (data) setExperiences(data as typeof experiences);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add() {
    const { data } = await supabase.from('experiences').insert({ role: 'New Role', company: '', location: '', start_date: '', end_date: '', bullets: [''], sort_order: experiences.length }).select().single();
    if (data) setExperiences([...experiences, data as typeof experiences[0]]);
  }

  async function remove(id: string) {
    await supabase.from('experiences').delete().eq('id', id);
    setExperiences(experiences.filter((e) => e.id !== id));
  }

  async function save() {
    setSaving(true);
    for (const e of experiences) {
      await supabase.from('experiences').upsert({ id: e.id, role: e.role, company: e.company, location: e.location, start_date: e.start_date, end_date: e.end_date, bullets: e.bullets, sort_order: e.sort_order }, { onConflict: 'id' });
    }
    setSaving(false);
  }

  if (loading) return <p className="empty-state">Loading...</p>;

  return (
    <div className="admin-section">
      <div className="admin-section-header"><h2>experience</h2><button onClick={add} className="admin-add-btn"><Plus size={15} /> add experience</button></div>
      {experiences.map((e, ei) => (
        <div className="admin-edit-card" key={e.id}>
          <div className="admin-edit-card-header"><span>experience {ei + 1}</span><button onClick={() => remove(e.id)} className="row-delete"><Trash2 size={14} /></button></div>
          <label><span>role</span><input value={e.role} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, role: ev.target.value } : x))} /></label>
          <label><span>company</span><input value={e.company} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, company: ev.target.value } : x))} /></label>
          <label><span>location</span><input value={e.location} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, location: ev.target.value } : x))} /></label>
          <div className="admin-two-col">
            <label><span>start date</span><input value={e.start_date} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, start_date: ev.target.value } : x))} /></label>
            <label><span>end date</span><input value={e.end_date} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, end_date: ev.target.value } : x))} /></label>
          </div>
          <label><span>bullets (Google XYZ format — one per line)</span><textarea rows={6} value={e.bullets.join('\n')} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, bullets: ev.target.value.split('\n') } : x))} /></label>
          <label><span>sort order</span><input type="number" value={e.sort_order} onChange={(ev) => setExperiences(experiences.map((x) => x.id === e.id ? { ...x, sort_order: parseInt(ev.target.value) || 0 } : x))} /></label>
        </div>
      ))}
      <button onClick={save} disabled={saving} className="admin-save-btn"><Save size={15} /> {saving ? 'saving...' : 'save all'}</button>
    </div>
  );
}

function CertificationsAdmin() {
  const [certs, setCerts] = useState<Array<{ id: string; title: string; issuer: string; year: string; sort_order: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('certifications').select('*').order('sort_order', { ascending: true });
    if (data) setCerts(data as typeof certs);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add() {
    const { data } = await supabase.from('certifications').insert({ title: 'New Certification', issuer: '', year: '', sort_order: certs.length }).select().single();
    if (data) setCerts([...certs, data as typeof certs[0]]);
  }

  async function remove(id: string) {
    await supabase.from('certifications').delete().eq('id', id);
    setCerts(certs.filter((c) => c.id !== id));
  }

  async function save() {
    setSaving(true);
    for (const c of certs) {
      await supabase.from('certifications').upsert({ id: c.id, title: c.title, issuer: c.issuer, year: c.year, sort_order: c.sort_order }, { onConflict: 'id' });
    }
    setSaving(false);
  }

  if (loading) return <p className="empty-state">Loading...</p>;

  return (
    <div className="admin-section">
      <div className="admin-section-header"><h2>certifications</h2><button onClick={add} className="admin-add-btn"><Plus size={15} /> add certification</button></div>
      {certs.map((c, ci) => (
        <div className="admin-edit-card compact" key={c.id}>
          <div className="admin-edit-card-header"><span>certification {ci + 1}</span><button onClick={() => remove(c.id)} className="row-delete"><Trash2 size={14} /></button></div>
          <label><span>title</span><input value={c.title} onChange={(e) => setCerts(certs.map((x) => x.id === c.id ? { ...x, title: e.target.value } : x))} /></label>
          <label><span>issuer</span><input value={c.issuer} onChange={(e) => setCerts(certs.map((x) => x.id === c.id ? { ...x, issuer: e.target.value } : x))} /></label>
          <div className="admin-two-col">
            <label><span>year</span><input value={c.year} onChange={(e) => setCerts(certs.map((x) => x.id === c.id ? { ...x, year: e.target.value } : x))} /></label>
            <label><span>sort order</span><input type="number" value={c.sort_order} onChange={(e) => setCerts(certs.map((x) => x.id === c.id ? { ...x, sort_order: parseInt(e.target.value) || 0 } : x))} /></label>
          </div>
        </div>
      ))}
      <button onClick={save} disabled={saving} className="admin-save-btn"><Save size={15} /> {saving ? 'saving...' : 'save all'}</button>
    </div>
  );
}

function PublicationsAdmin() {
  const [pubs, setPubs] = useState<Array<{ id: string; title: string; journal: string; year: string; description: string; sort_order: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('publications').select('*').order('sort_order', { ascending: true });
    if (data) setPubs(data as typeof pubs);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function add() {
    const { data } = await supabase.from('publications').insert({ title: 'New Publication', journal: '', year: '', description: '', sort_order: pubs.length }).select().single();
    if (data) setPubs([...pubs, data as typeof pubs[0]]);
  }

  async function remove(id: string) {
    await supabase.from('publications').delete().eq('id', id);
    setPubs(pubs.filter((p) => p.id !== id));
  }

  async function save() {
    setSaving(true);
    for (const p of pubs) {
      await supabase.from('publications').upsert({ id: p.id, title: p.title, journal: p.journal, year: p.year, description: p.description, sort_order: p.sort_order }, { onConflict: 'id' });
    }
    setSaving(false);
  }

  if (loading) return <p className="empty-state">Loading...</p>;

  return (
    <div className="admin-section">
      <div className="admin-section-header"><h2>publications</h2><button onClick={add} className="admin-add-btn"><Plus size={15} /> add publication</button></div>
      {pubs.map((p, pi) => (
        <div className="admin-edit-card" key={p.id}>
          <div className="admin-edit-card-header"><span>publication {pi + 1}</span><button onClick={() => remove(p.id)} className="row-delete"><Trash2 size={14} /></button></div>
          <label><span>title</span><input value={p.title} onChange={(e) => setPubs(pubs.map((x) => x.id === p.id ? { ...x, title: e.target.value } : x))} /></label>
          <div className="admin-two-col">
            <label><span>journal</span><input value={p.journal} onChange={(e) => setPubs(pubs.map((x) => x.id === p.id ? { ...x, journal: e.target.value } : x))} /></label>
            <label><span>year</span><input value={p.year} onChange={(e) => setPubs(pubs.map((x) => x.id === p.id ? { ...x, year: e.target.value } : x))} /></label>
          </div>
          <label><span>description</span><textarea rows={3} value={p.description} onChange={(e) => setPubs(pubs.map((x) => x.id === p.id ? { ...x, description: e.target.value } : x))} /></label>
          <label><span>sort order</span><input type="number" value={p.sort_order} onChange={(e) => setPubs(pubs.map((x) => x.id === p.id ? { ...x, sort_order: parseInt(e.target.value) || 0 } : x))} /></label>
        </div>
      ))}
      <button onClick={save} disabled={saving} className="admin-save-btn"><Save size={15} /> {saving ? 'saving...' : 'save all'}</button>
    </div>
  );
}
