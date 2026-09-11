import { Link } from 'react-router-dom';
import {
  CapIcon,
  FileScanIcon,
  RouteIcon,
  LandmarkIcon,
  ShieldIcon,
  UsersIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
} from '../components/icons.jsx';

const SERVICES = [
  {
    icon: <FileScanIcon size={18} />,
    color: 'blue',
    title: 'AI Resume Match Analyzer',
    repo: 'https://github.com/aadi090204/AI-Resume-Match-Analyzer',
    text: 'FastAPI + Google Gemini service that parses a resume PDF (pypdf) and compares it against a job description, producing a match score, strong matches, gaps, ATS keywords and improved bullets. Integrated via HTTP proxy: Node /api/resume/analyze → FastAPI /analyze.',
  },
  {
    icon: <RouteIcon size={18} />,
    color: 'violet',
    title: 'SkillRoute Roadmap Engine',
    repo: 'https://github.com/balasaravanank/SkillRoute',
    text: "FastAPI + Groq agent that decides a best-fit career and generates a phased learning roadmap. Integrated directly as a Python library: the backend imports SkillRoute's own roadmap_agent.generate_roadmap() through a small bridge, bypassing only its Firebase-auth routes.",
  },
  {
    icon: <LandmarkIcon size={18} />,
    color: 'teal',
    title: 'Government Schemes Data',
    repo: null,
    text: 'A curated JSON dataset (backend/data/schemes.json) of GoI scholarships, internships and skilling programmes, served through /api/schemes with search, category filters and pagination. Swap the JSON file for a database later without touching the UI.',
  },
];

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 980 }}>
      <div className="page-head">
        <div>
          <span className="badge badge-brand">About SkillSetu</span>
          <h1 style={{ marginTop: 10 }}>
            Academia–industry collaboration, made practical
          </h1>
          <p className="section-sub">
            SkillSetu is our Smart India Hackathon prototype for the problem statement
            “Portal for Academia – Industry Collaboration for Skill Mapping, Internships
            and Placement”. This build focuses on three fully working features.
          </p>
        </div>
      </div>

      {/* What it does */}
      <div className="kv-grid" style={{ marginTop: 8 }}>
        <div className="card card-pad kv-card">
          <span className="feature-icon blue" style={{ width: 42, height: 42, borderRadius: 12 }}>
            <FileScanIcon size={20} />
          </span>
          <h4 style={{ marginTop: 12 }}>AI Resume Analyzer</h4>
          <p>
            Students upload a resume PDF and paste any job description. The Gemini-powered
            engine returns a match score, skill gaps, ATS keywords and honest,
            non-exaggerated improvement suggestions.
          </p>
        </div>
        <div className="card card-pad kv-card">
          <span className="feature-icon violet" style={{ width: 42, height: 42, borderRadius: 12 }}>
            <RouteIcon size={20} />
          </span>
          <h4 style={{ marginTop: 12 }}>Personalized Career Roadmap</h4>
          <p>
            The SkillRoute AI agent analyzes skills, interests, available time and
            learning pace, decides the best-fit career, and produces a phased roadmap
            with free learning resources for every milestone.
          </p>
        </div>
        <div className="card card-pad kv-card">
          <span className="feature-icon teal" style={{ width: 42, height: 42, borderRadius: 12 }}>
            <LandmarkIcon size={20} />
          </span>
          <h4 style={{ marginTop: 12 }}>Government Schemes Dashboard</h4>
          <p>
            A searchable, filterable dashboard of real Government of India schemes for
            students — scholarships, internships, skilling and entrepreneurship — each
            linked to its official portal.
          </p>
        </div>
        <div className="card card-pad kv-card">
          <span className="feature-icon" style={{ width: 42, height: 42, borderRadius: 12, background: 'linear-gradient(135deg,#475569,#94a3b8)' }}>
            <ShieldIcon size={20} />
          </span>
          <h4 style={{ marginTop: 12 }}>Privacy-first by design</h4>
          <p>
            No sign-up, no tracking. Resumes are processed in-memory and never stored;
            saved schemes live only in your browser's localStorage.
          </p>
        </div>
      </div>

      {/* Integration architecture */}
      <div className="card card-pad" style={{ marginTop: 24 }}>
        <h3 className="section-title" style={{ fontSize: 19 }}>How the repositories are integrated</h3>
        <p className="section-sub">
          SkillSetu does not reimplement the two open-source projects — it wraps and
          connects them behind one clean API surface.
        </p>

        <div className="about-flow" style={{ marginTop: 18 }}>
          <span className="flow-pill">React (Vite)</span>
          <span className="flow-arrow">→</span>
          <span className="flow-pill">Node/Express API :4000</span>
          <span className="flow-arrow">→</span>
          <span className="flow-pill">FastAPI :8001 (resume)</span>
          <span className="flow-arrow">→</span>
          <span className="flow-pill">Gemini</span>
        </div>
        <div className="about-flow">
          <span className="flow-pill">React (Vite)</span>
          <span className="flow-arrow">→</span>
          <span className="flow-pill">Node/Express API :4000</span>
          <span className="flow-arrow">→</span>
          <span className="flow-pill">Python bridge (library import)</span>
          <span className="flow-arrow">→</span>
          <span className="flow-pill">SkillRoute agent</span>
          <span className="flow-arrow">→</span>
          <span className="flow-pill">Groq</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
          {SERVICES.map((s) => (
            <div key={s.title} style={{ border: '1px solid var(--line-soft)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span className={`feature-icon ${s.color}`} style={{ width: 38, height: 38, borderRadius: 11 }}>
                  {s.icon}
                </span>
                <b>{s.title}</b>
                {s.repo && (
                  <a
                    href={s.repo}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: 'auto', color: 'var(--brand-600)', fontSize: 13.5, fontWeight: 600, display: 'inline-flex', gap: 5, alignItems: 'center' }}
                  >
                    View repository <ExternalLinkIcon size={13} />
                  </a>
                )}
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.65, marginTop: 10 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* API surface */}
      <div className="card card-pad" style={{ marginTop: 24 }}>
        <h3 className="section-title" style={{ fontSize: 19 }}>API surface</h3>
        <pre className="raw-report" style={{ marginTop: 14, maxHeight: 'none' }}>{`GET  /api/health                  → service + integration status
GET  /api/schemes                 → list (q, category, page, pageSize, sort)
GET  /api/schemes/categories      → filter categories
GET  /api/schemes/stats           → counts by category & ministry
GET  /api/schemes/:id             → single scheme
POST /api/resume/analyze          → PDF + job description → structured analysis
GET  /api/resume/health           → analyzer connectivity
POST /api/roadmap/clarity         → rule-based career clarity score
POST /api/roadmap/generate        → profile → career decision + roadmap`}</pre>
      </div>

      {/* SIH note */}
      <div className="card card-pad" style={{ marginTop: 24, background: 'linear-gradient(120deg,#eff6ff,#f5f3ff)' }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span className="feature-icon blue" style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0 }}>
            <UsersIcon size={20} />
          </span>
          <div>
            <h3 style={{ fontSize: 17 }}>Built for Smart India Hackathon 2026</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.65, marginTop: 6 }}>
              This prototype deliberately scopes out chatbots, job portals, payments,
              complex authentication and admin panels — those are documented as future
              extensions. The architecture (React + Express + pluggable services) is
              modular so internships, placement tracking and industry collaboration
              features can be added without a rebuild.
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-sm" style={{ marginTop: 14 }}>
              Try the dashboard <ArrowRightIcon size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 20, color: 'var(--faint)', fontSize: 13 }}>
        <CapIcon size={15} /> SkillSetu · Portal for Academia–Industry Collaboration
      </div>
    </div>
  );
}
