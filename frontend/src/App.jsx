import { useEffect, useState } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { CapIcon, MenuIcon, XIcon, ArrowRightIcon } from './components/icons.jsx';
import { useAuth } from './services/auth.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import { isOnboarded, markOnboarded, seedFromAccount } from './services/profile.js';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/resume-analyzer', label: 'Resume Analyzer' },
  { to: '/career-roadmap', label: 'Career Roadmap' },
  { to: '/government-schemes', label: 'Gov Schemes' },
  { to: '/about', label: 'About' },
];

export default function App() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  /* First-visit onboarding window (once per browser) */
  const [showOnboarding, setShowOnboarding] = useState(false);
  useEffect(() => {
    if (!isOnboarded()) setShowOnboarding(true);
  }, []);

  /* Seed the career profile with account skills when a user logs in */
  useEffect(() => {
    if (user) seedFromAccount(user);
  }, [user]);

  function closeOnboarding(saved) {
    setShowOnboarding(false);
    markOnboarded(); // don't nag returning visitors
    if (saved) navigate('/dashboard');
  }

  return (
    <div className="shell">
      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-logo">
              <CapIcon size={20} />
            </span>
            <span>
              <span className="brand-name">SkillSetu</span>{' '}
              <span className="brand-tag">SIH 2026</span>
            </span>
          </Link>

          <nav className={`nav-links ${open ? 'open' : ''}`}>
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {!loading && !user && (
              <div className="nav-auth-mobile">
                <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                  Sign up
                </Link>
              </div>
            )}
          </nav>

          <div className="nav-cta">
            {loading ? (
              <span className="nav-user-skeleton" aria-hidden="true" />
            ) : user ? (
              <div className="nav-user">
                <span className="nav-avatar" title={user.email}>
                  {user.fullName.trim().charAt(0).toUpperCase()}
                </span>
                <span className="nav-user-name">{user.fullName.split(/\s+/)[0]}</span>
                <button
                  className="btn btn-ghost btn-sm logout-btn"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign up <ArrowRightIcon size={15} />
                </Link>
              </>
            )}
            <button
              className="nav-toggle"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {open ? <XIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <main className="shell-main" key={pathname}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-brand">
              <div className="brand">
                <span className="brand-logo">
                  <CapIcon size={18} />
                </span>
                <span className="brand-name">SkillSetu</span>
              </div>
              <p>
                A Smart India Hackathon prototype bridging academia and industry —
                AI resume analysis, personalized career roadmaps and government
                welfare schemes, in one student portal.
              </p>
            </div>
            <div>
              <div className="footer-title">Platform</div>
              <div className="footer-col" style={{ marginTop: 8 }}>
                <Link to="/resume-analyzer">AI Resume Analyzer</Link>
                <Link to="/career-roadmap">Career Roadmap</Link>
                <Link to="/government-schemes">Government Schemes</Link>
              </div>
            </div>
            <div>
              <div className="footer-title">Resources</div>
              <div className="footer-col" style={{ marginTop: 8 }}>
                <Link to="/dashboard">Student Dashboard</Link>
                <Link to="/government-schemes/saved">Saved Schemes</Link>
                <Link to="/about">About &amp; Integration</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} SkillSetu · Smart India Hackathon prototype</span>
            <span>Built with React · Node.js · FastAPI · Gemini · Groq</span>
          </div>
        </div>
      </footer>

      {showOnboarding && <OnboardingModal onClose={closeOnboarding} />}
    </div>
  );
}
