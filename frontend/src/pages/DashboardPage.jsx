import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileScanIcon,
  RouteIcon,
  LandmarkIcon,
  ArrowRightIcon,
  SearchIcon,
  BookmarkIcon,
  ClockIcon,
  ZapIcon,
  TargetIcon,
} from '../components/icons.jsx';
import { fetchHealth, fetchSchemeStats } from '../services/api.js';
import { getActivity, getSavedSchemes, getStudentName } from '../services/localStore.js';

const FEATURE_CARDS = [
  {
    to: '/resume-analyzer',
    icon: <FileScanIcon size={22} />,
    color: 'blue',
    title: 'AI Resume Analyzer',
    text: 'Score your resume against a job description with Gemini — strong matches, skill gaps, ATS keywords and improved bullets.',
    cta: 'Analyze now',
  },
  {
    to: '/career-roadmap',
    icon: <RouteIcon size={22} />,
    color: 'violet',
    title: 'Career Roadmap',
    text: 'The SkillRoute agent picks your best-fit career and generates a phased learning plan with free resources.',
    cta: 'Generate roadmap',
  },
  {
    to: '/government-schemes',
    icon: <LandmarkIcon size={22} />,
    color: 'teal',
    title: 'Government Schemes',
    text: 'Search scholarships, internships and skilling programmes from the Government of India with official links.',
    cta: 'Browse schemes',
  },
];

function timeAgo(ts) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export default function DashboardPage() {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [saved, setSaved] = useState([]);
  const [activity, setActivity] = useState([]);
  const [name] = useState(getStudentName());

  useEffect(() => {
    setSaved(getSavedSchemes());
    setActivity(getActivity());
    fetchSchemeStats().then(setStats).catch(() => setStats(null));
    fetchHealth().then(setHealth).catch(() => setHealth({ services: { backend: true } }));
  }, []);

  const svc = health?.services || {};

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      {/* Welcome */}
      <section className="dash-welcome">
        <h1>Welcome back{name ? `, ${name}` : ''} 👋</h1>
        <p>
          Your personalized career hub. Analyze resumes, build skill roadmaps and
          unlock government benefits — everything below is fully functional.
        </p>
        <div className="dash-actions">
          <Link to="/resume-analyzer" className="btn btn-primary">
            <FileScanIcon size={16} /> Analyze Resume
          </Link>
          <Link
            to="/career-roadmap"
            className="btn"
            style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}
          >
            <RouteIcon size={16} /> Build Roadmap
          </Link>
        </div>
      </section>

      {/* Service status */}
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 16, fontSize: 13 }}>
        <span className="status-row">
          <span className={`status-dot ${svc.backend ? 'ok' : 'down'}`} /> Main API
        </span>
        <span className="status-row">
          <span className={`status-dot ${svc.resumeAnalyzer ? 'ok' : 'warn'}`} />{' '}
          Resume Analyzer {svc.resumeAnalyzer ? '' : '(start Python service)'}
        </span>
        <span className="status-row">
          <span className={`status-dot ${svc.roadmapEngine ? 'ok' : 'warn'}`} />{' '}
          Roadmap Engine {svc.roadmapEngine ? '' : '(set GROQ_API_KEY)'}
        </span>
      </div>

      {/* Feature cards */}
      <div className="dash-grid">
        {FEATURE_CARDS.map((c) => (
          <Link key={c.title} to={c.to} className="card card-hover dash-card">
            <span className={`feature-icon ${c.color}`}>{c.icon}</span>
            <h3>{c.title}</h3>
            <p>{c.text}</p>
            <div className="dash-card-meta">
              <span className="feature-link">{c.cta}</span>
              <ArrowRightIcon size={16} color="var(--faint)" />
            </div>
          </Link>
        ))}
      </div>

      {/* Progress + recent */}
      <div className="dash-two-col">
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="section-title" style={{ fontSize: 17 }}>
              Career progress
            </h3>
            <Link to="/career-roadmap" className="btn btn-ghost btn-sm">
              Open roadmap
            </Link>
          </div>
          <p className="section-sub" style={{ marginTop: 4 }}>
            Your journey at a glance.
          </p>

          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>Saved government schemes</span>
                <span style={{ color: 'var(--muted)' }}>{saved.length} bookmarked</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, saved.length * 10)}%` }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, marginBottom: 8 }}>
                <span style={{ fontWeight: 600 }}>Schemes available on the portal</span>
                <span style={{ color: 'var(--muted)' }}>{stats?.total ?? '—'}</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span className="badge badge-amber">
                <TargetIcon size={13} /> Set a target role in the Roadmap tool
              </span>
              <span className="badge badge-brand">
                <ZapIcon size={13} /> Analyze a resume to unlock suggestions
              </span>
            </div>
          </div>
        </div>

        <div className="card card-pad">
          <h3 className="section-title" style={{ fontSize: 17 }}>
            Recent activity
          </h3>
          <p className="section-sub" style={{ marginTop: 4 }}>
            Schemes you viewed and tools you used.
          </p>
          {activity.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 12px' }}>
              <div className="icon">
                <ClockIcon size={24} />
              </div>
              <h3>Nothing here yet</h3>
              <p>Visit a scheme or run an analysis and it will appear here.</p>
            </div>
          ) : (
            <div className="activity-list" style={{ marginTop: 10 }}>
              {activity.slice(0, 6).map((a, i) => (
                <div className="activity-item" key={i}>
                  {a.type === 'scheme' ? (
                    <LandmarkIcon size={16} color="var(--teal)" />
                  ) : (
                    <ZapIcon size={16} color="var(--brand-600)" />
                  )}
                  {a.target ? (
                    <Link to={a.target} style={{ color: 'var(--ink-2)' }}>
                      {a.title}
                    </Link>
                  ) : (
                    <span style={{ color: 'var(--ink-2)' }}>{a.title}</span>
                  )}
                  <span className="t">{timeAgo(a.at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Saved schemes + quick actions */}
      <div className="dash-two-col" style={{ marginTop: 20 }}>
        <div className="card card-pad">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 className="section-title" style={{ fontSize: 17 }}>
              Saved schemes
            </h3>
            {saved.length > 0 && (
              <Link to="/government-schemes/saved" className="btn btn-ghost btn-sm">
                View all
              </Link>
            )}
          </div>
          {saved.length === 0 ? (
            <div className="empty-state" style={{ padding: '28px 12px' }}>
              <div className="icon">
                <BookmarkIcon size={24} />
              </div>
              <h3>No saved schemes yet</h3>
              <p>
                Bookmark schemes from the{' '}
                <Link to="/government-schemes" style={{ color: 'var(--brand-600)', fontWeight: 600 }}>
                  Government Schemes
                </Link>{' '}
                page to track them here.
              </p>
            </div>
          ) : (
            <div className="saved-list" style={{ marginTop: 12 }}>
              {saved.slice(0, 4).map((s) => (
                <Link
                  key={s.id}
                  to={`/government-schemes?open=${s.id}`}
                  className="card"
                  style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}
                >
                  <LandmarkIcon size={18} color="var(--teal)" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{s.name}</div>
                    <div style={{ color: 'var(--faint)', fontSize: 12.5 }}>{s.ministry}</div>
                  </div>
                  <span className="badge badge-teal">{s.category}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="card card-pad">
          <h3 className="section-title" style={{ fontSize: 17 }}>
            Quick actions
          </h3>
          <div className="quick-actions" style={{ marginTop: 16 }}>
            <Link to="/resume-analyzer" className="quick-action">
              <FileScanIcon size={16} color="var(--brand-600)" /> Analyze a resume
              <span>Match score + gaps</span>
            </Link>
            <Link to="/career-roadmap" className="quick-action">
              <RouteIcon size={16} color="var(--violet)" /> Generate roadmap
              <span>AI career plan</span>
            </Link>
            <Link to="/government-schemes" className="quick-action">
              <SearchIcon size={16} color="var(--teal)" /> Search schemes
              <span>Scholarships & more</span>
            </Link>
            <Link to="/government-schemes/saved" className="quick-action">
              <BookmarkIcon size={16} color="var(--amber)" /> Saved schemes
              <span>{saved.length} bookmarked</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
