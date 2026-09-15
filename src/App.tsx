import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Circle,
  Command,
  Download,
  ExternalLink,
  FileText,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Minus,
  Send,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { useSiteSettings } from './lib/useSiteSettings';
import { useResumeDownload } from './lib/useResumeDownload';
import { usePortfolioContent } from './lib/usePortfolioContent';
import AdminPanel from './AdminPanel';

const asciiPortrait = String.raw`....................................................................................................
....................................................................................................
....................................................................................................
....................................................................................................
....................................................................................................
.......................................:-==+**#%@@@@@@@@@@@@@#*=-:..................................
..................................:-+%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%=:..............................
...............................:+%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+=-:..........................
............................:=%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%+=:........................
...........................-#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+:.......................
.........................:+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%=......................
........................:#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@+:....................
.......................:@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#:...................
......................:@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*:..................
.....................:@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%-..................
.....................=@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@+..................
....................:%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%#*******###%@@@@@@@@@@@@@@@@*:.................
....................:@@@@@@@@@@@@@@@%%@@@@@@@@@%%##**************##%@@@@@@@@@@@@@#:.................
....................-@@@@@@@@@@@@@%%@@@@@@@@@%#*++++++++++++++++++**##@@@@@@@@@@@%-.................
....................-@@@@@@@@@@@@%%%%%@@@@%#***++++++++++++++++++++++*%@@@@@@@@@@@-.................
....................:%@@@@@@@@@@@%%%#####*********+++++++++++++++++++*#%@@@@@@@@@@-.................
....................:+@@@@@@@%%%%%%%#####****************+++++++++++++*%@@@@@@@@@=..................
.....................=@@@@@@%%%%%%%####********++++***+++====++++++++++*%@@@@@@@@@=.................
.....................:@@@@@@%%%%%####***+++++++--==-=++========++++++++**%@@@@@@@@-.................
.....................:%@@@@%%%%%%%##***+++++====+++===========++**********#@@@@@@*:.................
......................*@@@%%%%@@@@@@@@@@@%#**+==----=++**#%@@@@@@%%%%#**+**#@@@@@+..................
......................=@@@##%%%%%%###*=.:=###**+====++***+=:.:++****+**+++:+%@@@@=..................
......................:@+*-=#########*=:.=***++++--:-=++**+=:-*###*+=-:::..=-+@@@-..................
......................:*++**%%%%@@@%@@%%#%%%%**++==-=+**####%%%#*#%#=-:::=+##*%@%:..................
.....................:+*@@+#%%%@@@#*%@@%**#%%#*#*++++=**##**%@%*+*%#=::::-+**@%#+++-................
.....................+%%@#=*#####%%%%%%####%%**#*+==+-+************+==---=+++*#+*#*=:...............
.....................+##%#==#****#########%##*##*+===::+++*++++++++=====-=+++*%*+++=:..............
.....................:*####=********######**:+##+====-.:===++****+==----===+++#++++:...............
......................*#%##*=**+++********+=+##+======:===========-----===+++#*++-................
......................+%%####*==++++++===+##%%#*++=====+++=----------======+++##++:................
......................-#%#######******++++*####**=--=====+==---------======++*%#+=.................
.......................*%%#####******+++++*######+==+**++++++===-----======++#%*+=.................
.......................=%@######******+**####%%%##**+++**++++++===--======++*%+==..................
.......................*%@%##%###******#####%%%%#**#**###***++++==========+*#%#===.................
.......................-*#@%%%%#######%%@@@@@@@%######%%%##%%%#*+++=====+++*#%#===.................
.......................:*#@%%%%#####%@@@@@%%%%%%###******##%%@@%*+=====++++*#%*+=:.................
.........................:=%%%%#####%@@@@@@@@@%%##****####%%%@@@*+====++++**%+:....................
...........................+%%%%####%@@%%%%%%%#*+++====++++++*##+=====++++*#%:......................
...........................:#@%%%#####%%%%%####******++==+++++++======++**#@=.......................
............................:%@%%%######%%%%##%#####***++++++++++===+++*#%%+........................
.............................:*@%%%%%########****+++++++=====++++++++**#%%=.........................
..............................:+@@%%%%%%#####***++++++=======++**+***#%@%#:........................
...............................-#@@@@@%%####***++++=======++#**##%%%#***:..........................
...............................:+%@@@@@@%%####****+++++++*##%%%#%%%%##***@@#-.......................
...............................:+%%@@@@@@@%%%%%###%%##*##%%@@%@%%%#*****@@@@@#=:....................
...............................:+%%%%@@@@@@@@@@@%%@@@@@%%@%%@@%##***+++#@@@@@@@@%%#+=-::............
...............................-#@%%%%%%%@@@@@@@%%%%%%%%%%%%%%##***++++-+@@@@@@@@@@@@@@@%#+=-::.....
............................:-*@@%%%####%%%%@@@%%%%%%%%%%####***++++++-.*@@@@@@@@@@@@@@@@@@@@@%#*=--
.......................::-=#@@@@#=%%######%%%%%%%%%%######***+++++++*-..%@@@@@@@@@@@@@@@@@@@@@@@@%%%
....................:+%@@@@@@@@#-+##########%%%%#######****++++++*#*-..:%@@@@@@@@@@@@@@@@@@@@@@@@@@@
..............:-*@@@@@@@@@@@@@%:-*%###############********+++****#=....-@@@@@@@@@@@@@@@@@@@@@@@@@@@@
.........:=#%@@@@@@@@@@@@@@@@@=.:*%#############****++++++******+:.....*@@@@@@@@@@@@@@@@@@@@@@@@@@@@
...:=*%@@@@@@@@@@@@@@@@@@@@@@%..:###**#####********+++++***####+.......%@@@@@@@@@@@@@@@@@@@@@@@@@@@@
*#@@@@@@@@@@@@@@@@@@@@@@@@@@@@-.-%#***#####**************#####=.......-%@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#..+##**#######***********#####=........*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=::.=*****#####**********####*=.........%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@-:::.......:=********#######*-.........-@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%-.::..........:+***#######*=...........+@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#:...............:+**#####+............:#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@=:::...:::.........=*###*:.............:%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%::::::.....:........-#*-...............=@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@*::::::::....::.......:................:*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@-.......::::..::.......................:#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@%:......:.:::::::.......................=%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@#:.....:::::::::::::...................:*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@`;

const gmailUrl = 'https://mail.google.com/mail/u/0/?fs=1&to=shashidharan2005@gmail.com&su=Hire+-+Shashidharan+V&body=Hi+Shashidharan,%0A%0AI+came+across+your+portfolio+and+would+like+to+hire+you+for:%0A%0A%5Bplease+add+your+message+here%5D%0A%0ALooking+forward+to+hearing+from+you.%0A%0ABest+regards,%0A%5Byour+name%5D&tf=cm';

type SectionKey = 'about' | 'introduction' | 'experience' | 'projects' | 'skills' | 'education' | 'certifications' | 'publication';

const sectionLabels: Array<{ key: SectionKey; label: string; hint: string }> = [
  { key: 'about', label: 'about', hint: 'profile + contact matrix' },
  { key: 'introduction', label: 'introduction', hint: 'summary / signal' },
  { key: 'experience', label: 'experience', hint: 'professional timeline' },
  { key: 'projects', label: 'projects', hint: 'selected builds' },
  { key: 'skills', label: 'skills', hint: 'capability index' },
  { key: 'education', label: 'education', hint: 'academic record' },
  { key: 'certifications', label: 'certifications', hint: 'credentials' },
  { key: 'publication', label: 'publication', hint: 'research output' },
];

function App() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.pathname.startsWith('/admin'));
  const [activeSection, setActiveSection] = useState<SectionKey>('about');
  const [command, setCommand] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  const { settings } = useSiteSettings();
  const downloadResume = useResumeDownload();
  const content = usePortfolioContent();

  useEffect(() => {
    const onPop = () => setIsAdmin(window.location.pathname.startsWith('/admin'));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (isAdmin) return <AdminPanel />;

  const visibleContent = useMemo(() => {
    const contentMap: Record<SectionKey, React.ReactNode> = {
      about: (
        <div className="about-grid">
          <div>
            <p className="eyebrow">/ identity.profile</p>
            <h1>Shashidharan V</h1>
            <p className="role">{settings.role}</p>
            <p className="bio">{settings.bio}</p>
            <div className="metrics">
              <Metric value="9.24/10" label="BCA CGPA" />
              <Metric value="100K+" label="rows analyzed" />
              <Metric value="130+" label="sources reviewed" />
            </div>
            <div className="contact-list">
              <a href="mailto:shashidharan2005@gmail.com"><Mail size={15} /> shashidharan2005@gmail.com</a>
              <a href="tel:+919686287046"><Command size={15} /> +91 9686287046</a>
              <span><MapPin size={15} /> {settings.location}</span>
              <a className="contact-cta" href={gmailUrl} target="_blank" rel="noopener noreferrer"><Send size={15} /> Hire Me !</a>
            </div>
          </div>
          <div className="portrait-shell">
            <div className="portrait-label"><span>portrait.dat</span><span>{settings.profile_image ? 'PHOTO / RGB' : 'ASCII / monochrome'}</span></div>
            {settings.profile_image ? (
              <img src={settings.profile_image} alt="Shashidharan V" className="portrait-photo" />
            ) : (
              <pre className="portrait">{asciiPortrait}</pre>
            )}
          </div>
        </div>
      ),
      introduction: <Introduction sections={content.introSections} loading={content.loading} />,
      experience: <ExperienceTimeline experiences={content.experiences} loading={content.loading} />,
      projects: <ProjectsView content={content} />,
      skills: <Skills />,
      education: <Education />,
      certifications: <CertificationsList certifications={content.certifications} loading={content.loading} />,
      publication: <PublicationsList publications={content.publications} loading={content.loading} />,
    };
    return contentMap[activeSection];
  }, [activeSection, settings, content]);

  const commandAliases: Record<string, SectionKey> = {
    about: 'about',
    introduction: 'introduction',
    intro: 'introduction',
    summary: 'introduction',
    experience: 'experience',
    exp: 'experience',
    work: 'experience',
    projects: 'projects',
    project: 'projects',
    skills: 'skills',
    skill: 'skills',
    education: 'education',
    edu: 'education',
    certifications: 'certifications',
    certs: 'certifications',
    certification: 'certifications',
    publication: 'publication',
    pub: 'publication',
    research: 'publication',
  };

  function runCommand(value: string) {
    const normalized = value.trim().toLowerCase();
    setLastCommand(normalized);
    setCommand('');
    if (normalized === 'clear') {
      setLastCommand('');
      return;
    }
    if (normalized === 'help') return;
    if (normalized === 'linkedin') { window.open('https://www.linkedin.com/in/shashidharan-v-37b68b2b9', '_blank', 'noopener,noreferrer'); return; }
    if (normalized === 'github') { window.open('https://github.com/Shashidharan-2005', '_blank', 'noopener,noreferrer'); return; }
    if (normalized === 'download' || normalized === 'resume') { downloadResume(); return; }
    if (normalized === 'contact') { window.open(gmailUrl, '_blank', 'noopener,noreferrer'); return; }
    const aliasTarget = commandAliases[normalized];
    if (aliasTarget) setActiveSection(aliasTarget);
  }

  return (
    <main className="app-shell">
      <div className="terminal-window">
        <header className="terminal-header">
          <div className="window-controls" aria-hidden="true"><Circle size={10} fill="currentColor" /><Circle size={10} fill="currentColor" /><Circle size={10} fill="currentColor" /></div>
          <div className="window-title"><TerminalIcon size={14} /> shashidharan@portfolio:~</div>
          <div className="header-status"><span className="status-dot" /> Open for Analytics opportunities.</div>
        </header>
        <div className="terminal-body">
          <aside className="sidebar">
            <div className="brand"><TerminalIcon size={18} /><span>portfolio<span className="brand-muted">.shashidharan.v</span></span></div>
            <div className="side-caption">NAVIGATION / 08 NODES</div>
            <nav>
              {sectionLabels.map((section, index) => (
                <button className={`nav-item ${activeSection === section.key ? 'active' : ''}`} key={section.key} onClick={() => setActiveSection(section.key)}>
                  <span className="nav-index">0{index + 1}</span><span className="nav-label">{section.label}</span><span className="nav-hint">{section.hint}</span>
                </button>
              ))}
            </nav>
            <div className="sidebar-footer">
              <div className="side-caption">EXTERNAL LINKS</div>
              <a href="https://www.linkedin.com/in/shashidharan-v-37b68b2b9" target="_blank" rel="noreferrer"><Linkedin size={15} /> LinkedIn <ExternalLink size={12} /></a>
              <a href="https://github.com/Shashidharan-2005" target="_blank" rel="noreferrer"><Github size={15} /> GitHub <ExternalLink size={12} /></a>
            </div>
          </aside>
          <section className="content-area">
            <div className="breadcrumb"><span>~/portfolio</span><ChevronRight size={14} /><span className="accent">{activeSection}.view</span><span className="cursor" /></div>
            <div className="content-scroll">{visibleContent}</div>
            <div className="command-area">
              <div className="command-line"><span className="prompt">guest</span><span className="path"> ~/portfolio $</span><input value={command} onChange={(event) => setCommand(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') runCommand(command); }} placeholder="type a command (try: help, about, skills, projects, linkedin, download)..." aria-label="Terminal command" autoComplete="off" /></div>
              {lastCommand && <CommandResult command={lastCommand} aliasTarget={commandAliases[lastCommand]} />}
            </div>
          </section>
        </div>
        <footer className="quick-access">
          <span className="quick-label">QUICK ACCESS</span>
          <button onClick={() => setActiveSection('introduction')}>intro</button>
          <button onClick={() => setActiveSection('experience')}>experience</button>
          <button onClick={() => setActiveSection('projects')}>projects</button>
          <button onClick={() => setActiveSection('skills')}>skills</button>
          <button onClick={downloadResume} className="download-button"><Download size={13} /> resume.pdf</button>
          <span className="quick-spacer" />
          <span className="hint"><Minus size={12} /> enter to execute</span>
        </footer>
      </div>
    </main>
  );
}

function CommandResult({ command, aliasTarget }: { command: string; aliasTarget: SectionKey | undefined }) {
  if (command === 'help') {
    return (
      <div className="command-result help-result">
        <span>available commands:</span>
        <code>about</code> <code>intro</code> <code>experience</code> <code>projects</code> <code>skills</code> <code>education</code> <code>certs</code> <code>publication</code>
        <span className="sep">|</span>
        <code>linkedin</code> <code>github</code> <code>download</code> <code>contact</code> <code>clear</code>
      </div>
    );
  }
  if (command === 'linkedin') return <div className="command-result">opening <strong>linkedin</strong> — redirecting to profile...</div>;
  if (command === 'github') return <div className="command-result">opening <strong>github</strong> — redirecting to profile...</div>;
  if (command === 'download' || command === 'resume') return <div className="command-result">downloading <strong>Shashidharan_V_Resume.pdf</strong>...</div>;
  if (command === 'contact') return <div className="command-result">opening <strong>gmail</strong> — compose window ready...</div>;
  if (aliasTarget) return <div className="command-result">navigating to <strong>{aliasTarget}</strong> — view loaded</div>;
  return <div className="command-result">command not found: <strong>{command}</strong> — type <strong>help</strong> for available commands</div>;
}

function Metric({ value, label }: { value: string; label: string }) {
  return <div className="metric"><strong>{value}</strong><span>{label}</span></div>;
}

function Introduction({ sections, loading }: { sections: ReturnType<typeof usePortfolioContent>['introSections']; loading: boolean }) {
  if (loading) return <div className="text-panel"><p className="eyebrow">/ profile.summary</p><p className="data-line">Loading...</p></div>;
  return (
    <div className="introduction">
      <p className="eyebrow">/ profile.summary</p>
      {sections.map((section) => (
        <div className="intro-section" key={section.id}>
          <h2 className="intro-heading">{section.heading}</h2>
          {section.body.map((line, i) => (
            <p className="intro-body" key={i}>{line}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

function ExperienceTimeline({ experiences, loading }: { experiences: ReturnType<typeof usePortfolioContent>['experiences']; loading: boolean }) {
  if (loading) return <div className="timeline"><p className="eyebrow">/ professional.timeline</p><p className="data-line">Loading...</p></div>;
  return (
    <div className="timeline">
      <p className="eyebrow">/ professional.timeline</p>
      {experiences.map((exp) => (
        <article className="timeline-item" key={exp.id}>
          <div className="timeline-date">{exp.start_date} — {exp.end_date}</div>
          <h2>{exp.role}</h2>
          <p className="muted">{exp.company} <span>/</span> {exp.location}</p>
          <ul>
            {exp.bullets.map((bullet, i) => <li key={i}>{bullet}</li>)}
          </ul>
        </article>
      ))}
    </div>
  );
}

function ProjectsView({ content }: { content: ReturnType<typeof usePortfolioContent> }) {
  if (content.loading) return <div className="projects"><p className="eyebrow">/ selected.projects</p><p className="data-line">Loading...</p></div>;
  return (
    <div className="projects">
      <p className="eyebrow">/ selected.projects</p>
      {content.projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          images={content.projectImages[project.id] ?? []}
          pdfs={content.projectPdfs[project.id] ?? []}
        />
      ))}
    </div>
  );
}

function ProjectCard({ project, images, pdfs }: {
  project: ReturnType<typeof usePortfolioContent>['projects'][0];
  images: ReturnType<typeof usePortfolioContent>['projectImages'][string];
  pdfs: ReturnType<typeof usePortfolioContent>['projectPdfs'][string];
}) {
  const [slideIndex, setSlideIndex] = useState(0);
  const hasImages = images.length > 0;

  return (
    <article className="project-card">
      <div className="card-top">
        <h2>{project.title}</h2>
        <span>{project.date}</span>
      </div>
      {hasImages && (
        <div className="project-slideshow">
          <img src={images[slideIndex].image_url} alt={`${project.title} screenshot ${slideIndex + 1}`} />
          {images.length > 1 && (
            <>
              <button className="slide-btn slide-prev" onClick={() => setSlideIndex((i) => (i - 1 + images.length) % images.length)}><ChevronLeft size={18} /></button>
              <button className="slide-btn slide-next" onClick={() => setSlideIndex((i) => (i + 1) % images.length)}><ChevronRight size={18} /></button>
              <div className="slide-dots">
                {images.map((_, i) => (
                  <button className={`slide-dot ${i === slideIndex ? 'active' : ''}`} key={i} onClick={() => setSlideIndex(i)} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <p className="project-desc"><span className="line-marker">›</span>{project.description}</p>
      <div className="tags">{project.tags}</div>
      {pdfs.length > 0 && (
        <div className="project-pdfs">
          {pdfs.map((pdf) => (
            <a key={pdf.id} href={pdf.pdf_url} target="_blank" rel="noopener noreferrer" className="pdf-link">
              <FileText size={14} /> {pdf.label}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

function CertificationsList({ certifications, loading }: { certifications: ReturnType<typeof usePortfolioContent>['certifications']; loading: boolean }) {
  if (loading) return <div className="text-panel"><p className="eyebrow">/ credential.registry</p><p className="data-line">Loading...</p></div>;
  return (
    <div className="certifications-view">
      <p className="eyebrow">/ credential.registry</p>
      {certifications.map((cert) => (
        <div className="cert-card" key={cert.id}>
          <div>
            <h2>{cert.title}</h2>
            <p className="muted">{cert.issuer}</p>
          </div>
          <span className="cert-year">{cert.year}</span>
        </div>
      ))}
    </div>
  );
}

function PublicationsList({ publications, loading }: { publications: ReturnType<typeof usePortfolioContent>['publications']; loading: boolean }) {
  if (loading) return <div className="text-panel"><p className="eyebrow">/ research.output</p><p className="data-line">Loading...</p></div>;
  return (
    <div className="publications-view">
      <p className="eyebrow">/ research.output</p>
      {publications.map((pub) => (
        <div className="pub-card" key={pub.id}>
          <h2>{pub.title}</h2>
          <p className="muted">{pub.journal} <span>/</span> {pub.year}</p>
          <p className="pub-desc">{pub.description}</p>
        </div>
      ))}
    </div>
  );
}

function Skills() {
  const groups = [['PROGRAMMING & DATA ANALYSIS', 'Python (Pandas, NumPy)', 'SQL', 'Exploratory Data Analysis (EDA)', 'Statistical Analysis', 'Data Cleaning', 'Data Validation', 'Data Quality', 'Data Modeling'], ['BUSINESS INTELLIGENCE & VISUALIZATION', 'Power BI', 'DAX', 'Power Query', 'Dashboard Development', 'Data Visualization', 'Business Reporting'], ['EXCEL & REPORTING', 'Microsoft Excel (Pivot Tables, XLOOKUP, INDEX-MATCH)', 'Reporting Automation'], ['DATABASES / TOOLS', 'SQLite', 'Relational Databases', 'Database Management', 'Git', 'GitHub'], ['BUSINESS SKILLS', 'Business Communication', 'Cross-Functional Collaboration', 'Documentation', 'Problem Solving', 'Critical Thinking', 'Process Improvement']];
  return <div className="skills"><p className="eyebrow">/ capability.index</p><div className="skill-grid">{groups.map(([title, ...items]) => <div className="skill-group" key={title}><h2>{title}</h2><div>{items.map((item) => <span key={item}>{item}</span>)}</div></div>)}</div></div>;
}

function Education() {
  return <div className="education"><p className="eyebrow">/ academic.record</p><div className="education-card"><div><span className="education-year">2026</span><h2>Aditya Institute of Management Studies & Research</h2><p>Bachelor of Computer Applications (BCA)</p></div><strong>CGPA: 9.24 / 10</strong></div><div className="education-card"><div><span className="education-year">2021 — 2023</span><h2>Dr. N.S.A.M. PU College, Bengaluru</h2><p>Pre-university education</p></div><strong>89.91%</strong></div></div>;
}

export default App;
