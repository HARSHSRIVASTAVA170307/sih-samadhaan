import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CapIcon, ArrowRightIcon } from '../components/icons.jsx';
import { login, signup } from '../services/api.js';
import { useAuth } from '../services/auth.jsx';
import { setStudentName } from '../services/localStore.js';

const INITIAL_FORM = {
  fullName: '',
  email: '',
  password: '',
  confirm: '',
  college: '',
  course: '',
  graduationYear: '',
  skills: '',
};

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/dashboard';
  const { login: setSession } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isSignup = mode === 'signup';

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  function validate() {
    if (isSignup && form.fullName.trim().length < 2) return 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      return 'Please enter a valid email address.';
    }
    if (form.password.length < 6) return 'Password must be at least 6 characters.';
    if (isSignup && form.password !== form.confirm) return 'Passwords do not match.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError('');
    setBusy(true);
    try {
      const data = isSignup
        ? await signup({
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            password: form.password,
            college: form.college.trim(),
            course: form.course.trim(),
            graduationYear: form.graduationYear.trim(),
            skills: form.skills.trim(),
          })
        : await login(form.email.trim(), form.password);
      setSession(data.user);
      if (isSignup) setStudentName(form.fullName.trim().split(/\s+/)[0]);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card card">
        <div className="auth-head">
          <span className="brand-logo auth-logo">
            <CapIcon size={20} />
          </span>
          <h1>{isSignup ? 'Create your SkillSetu account' : 'Welcome back'}</h1>
          <p>
            {isSignup
              ? 'One account for resume analysis, roadmaps and scheme tracking — your details stay with your profile.'
              : 'Log in to pick up where you left off.'}
          </p>
        </div>

        {error && (
          <div className="auth-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {isSignup && (
            <div className="field">
              <label htmlFor="fullName">Full name *</label>
              <input
                id="fullName"
                className="input"
                value={form.fullName}
                onChange={set('fullName')}
                placeholder="e.g. Harsh Srivastava"
                autoComplete="name"
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="authEmail">Email *</label>
            <input
              id="authEmail"
              className="input"
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="authPass">Password *</label>
              <input
                id="authPass"
                className="input"
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Min 6 characters"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
              />
            </div>
            {isSignup && (
              <div className="field">
                <label htmlFor="authConfirm">Confirm password *</label>
                <input
                  id="authConfirm"
                  className="input"
                  type="password"
                  value={form.confirm}
                  onChange={set('confirm')}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />
              </div>
            )}
          </div>

          {isSignup && (
            <details className="auth-more">
              <summary>College details (optional — personalizes your dashboard)</summary>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="authCollege">College</label>
                  <input
                    id="authCollege"
                    className="input"
                    value={form.college}
                    onChange={set('college')}
                    placeholder="e.g. IET Lucknow"
                  />
                </div>
                <div className="field">
                  <label htmlFor="authCourse">Course</label>
                  <input
                    id="authCourse"
                    className="input"
                    value={form.course}
                    onChange={set('course')}
                    placeholder="e.g. B.Tech CSE"
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="authYear">Graduation year</label>
                <input
                  id="authYear"
                  className="input"
                  value={form.graduationYear}
                  onChange={set('graduationYear')}
                  placeholder="e.g. 2027"
                />
              </div>
              <div className="field">
                <label htmlFor="authSkills">Current skills</label>
                <textarea
                  id="authSkills"
                  className="textarea"
                  rows={2}
                  value={form.skills}
                  onChange={set('skills')}
                  placeholder="e.g. Python, React, SQL"
                />
              </div>
            </details>
          )}

          <button className="btn btn-primary auth-submit" disabled={busy}>
            {busy
              ? isSignup
                ? 'Creating account...'
                : 'Logging in...'
              : isSignup
                ? 'Create account'
                : 'Log in'}
            {!busy && <ArrowRightIcon size={16} />}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? (
            <>
              Already registered? <Link to="/login">Log in</Link>
            </>
          ) : (
            <>
              New here? <Link to="/signup">Create an account</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
