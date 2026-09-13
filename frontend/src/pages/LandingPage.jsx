import { Link } from 'react-router-dom';
import {
  FileScanIcon,
  RouteIcon,
  LandmarkIcon,
  ArrowRightIcon,
  CheckIcon,
  UploadIcon,
  SparkIcon,
  TrophyIcon,
  BookmarkIcon,
  ZapIcon,
} from '../components/icons.jsx';

const FEATURES = [
  {
    icon: <FileScanIcon size={24} />,
    color: 'blue',
    title: 'AI Resume Analyzer',
    text: 'Upload your resume PDF, paste a job description and get an instant match score, skill-gap analysis, ATS keywords and recruiter-friendly improvement suggestions powered by Google Gemini.',
    to: '/resume-analyzer',
    cta: 'Analyze my resume',
  },
  {
    icon: <RouteIcon size={24} />,
    color: 'violet',
    title: 'Personalized Career Roadmap',
    text: 'Tell the SkillRoute AI agent about your skills and goals — it decides your best-fit career and builds a phased, time-bound learning roadmap with free, real resources for every milestone.',
    to: '/career-roadmap',
    cta: 'Build my roadmap',
  },
  {
    icon: <LandmarkIcon size={24} />,
    color: 'teal',
    title: 'Government Schemes Dashboard',
    text: 'Search and filter verified Government of India scholarships, internships and skilling programmes for students — with eligibility, benefits and direct official application links.',
    to: '/government-schemes',
    cta: 'Explore schemes',
  },
];

const STEPS = [
  {
    icon: <SparkIcon size={18} />,
    title: 'Tell us about you',
    text: 'Share your skills, education and interests — no sign-up needed for this prototype.',
  },
  {
    icon: <UploadIcon size={18} />,
    title: 'Get AI analysis',
    text: 'The resume analyzer scores your resume against any job description you target.',
  },
  {
    icon: <RouteIcon size={18} />,
    title: 'Follow your roadmap',
    text: 'SkillRoute plans phased learning with free courses, videos and documentation.',
  },
  {
    icon: <BookmarkIcon size={18} />,
    title: 'Claim what you deserve',
    text: 'Find and bookmark government schemes that fund your studies and skilling.',
  },
];

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="hero-badge">
              <span className="dot" />
              Smart India Hackathon 2026 · Team Samadhaan · Working prototype
            </span>
            <h1>
              Your career, <span className="accent">mapped intelligently</span> —
              resume to roadmap to rights.
            </h1>
            <p className="hero-sub">
              SkillSetu connects students with industry expectations and government
              support. Analyze your resume with AI, get a personalized learning
              roadmap for your dream career, and discover every government scheme
              you are eligible for — in one place.
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Get Started <ArrowRightIcon size={17} />
              </Link>
              <Link to="/government-schemes" className="btn btn-secondary btn-lg">
                Browse Gov Schemes
              </Link>
            </div>
            <p className="hero-note">
              Free to use · No sign-up required · Built for students, by students · In service of Digital India
            </p>
          </div>

          {/* Visual */}
          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-top">
                <strong style={{ fontSize: 14 }}>Resume Analysis</strong>
                <span className="badge badge-green">AI Verified</span>
              </div>
              <div className="hero-score">
                <span>78%</span>
              </div>
              <div style={{ textAlign: 'center', fontSize: 12.5, color: 'var(--muted)', marginBottom: 12 }}>
                Match score for “Frontend Developer”
              </div>
              {[
                ['React & JavaScript', '+ Strong match', 'var(--green)'],
                ['TypeScript', '+ Missing skill', 'var(--amber)'],
                ['Testing (Jest)', '+ Suggested', 'var(--brand-600)'],
              ].map(([k, v, c]) => (
                <div className="hero-mini-row" key={k}>
                  <span style={{ color: 'var(--ink-2)' }}>{k}</span>
                  <span style={{ color: c, fontWeight: 600, fontSize: 12.5 }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="hero-chip-float a">
              <TrophyIcon size={15} color="var(--amber)" /> Roadmap: Phase 2 of 5
            </div>
            <div className="hero-chip-float b">
              <LandmarkIcon size={15} color="var(--teal)" /> 24 schemes matched
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div style={{ maxWidth: 640 }}>
            <span className="badge badge-brand">Core Features</span>
            <h2 className="section-title" style={{ fontSize: 30, marginTop: 12 }}>
              Three tools, one career operating system
            </h2>
            <p className="section-sub">
              Everything on the platform is live and functional — connected to real
              AI engines and verified government sources.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <Link key={f.title} to={f.to} className="card card-hover feature-card">
                <span className={`feature-icon ${f.color}`}>{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
                <span className="feature-link">
                  {f.cta} <ArrowRightIcon size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how">
        <div className="container">
          <div style={{ maxWidth: 640 }}>
            <span className="badge badge-violet">How it works</span>
            <h2 className="section-title" style={{ fontSize: 30, marginTop: 12 }}>
              From confusion to clarity in four steps
            </h2>
          </div>
          <div className="how-steps">
            {STEPS.map((s, i) => (
              <div key={s.title} className="card how-step">
                <div className="how-step-num">{i + 1}</div>
                {s.icon}
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </div>
            ))}
          </div>

          <div className="stats-band">
            <div className="stats-band-grid">
              <div>
                <h3>25</h3>
                <p>Government schemes listed</p>
              </div>
              <div>
                <h3>2</h3>
                <p>AI engines integrated</p>
              </div>
              <div>
                <h3>4-6</h3>
                <p>Phases in every roadmap</p>
              </div>
              <div>
                <h3>100%</h3>
                <p>Official source links</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ paddingBottom: 24 }}>
        <div className="card card-pad" style={{ display: 'flex', flexWrap: 'wrap', gap: 18, alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(120deg,#eff6ff,#f5f3ff)' }}>
          <div>
            <h3 style={{ fontSize: 20 }}>Ready to plan your career properly?</h3>
            <p style={{ color: 'var(--muted)', marginTop: 6, fontSize: 14.5 }}>
              Start with a resume analysis or explore what the government already
              offers you. <ZapIcon size={14} style={{ display: 'inline' }} />
            </p>
          </div>
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Open Dashboard <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
