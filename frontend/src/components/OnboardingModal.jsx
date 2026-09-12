import { useState } from 'react';
import { XIcon, ArrowRightIcon, RouteIcon } from './icons.jsx';
import {
  CAREER_TARGETS,
  SKILL_SUGGESTIONS,
  INTEREST_SUGGESTIONS,
  TIMELINE_OPTIONS,
  getProfile,
  saveProfile,
  markOnboarded,
} from '../services/profile.js';

/*
 * First-visit onboarding window — asks for current skills, interests,
 * target career and timeline, then saves a local Career Profile used to
 * personalize the Dashboard and prefill the Roadmap form.
 */

const STEP_COUNT = 3;

export default function OnboardingModal({ onClose, showSkip = true }) {
  const [step, setStep] = useState(1);
  const [p, setP] = useState(() => getProfile());
  const [error, setError] = useState('');

  const set = (k) => (e) => setP((f) => ({ ...f, [k]: e.target.value }));

  function toggleInList(list, value) {
    const parts = list
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.some((x) => x.toLowerCase() === value.toLowerCase())) {
      return parts.filter((x) => x.toLowerCase() !== value.toLowerCase()).join(', ');
    }
    return [...parts, value].join(', ');
  }

  /* exact token match so "JavaScript" doesn't light up the "Java" chip */
  function hasToken(list, value) {
    return list
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .includes(value.toLowerCase());
  }

  function canContinue() {
    if (step === 1) return p.skills.trim().length > 0;
    return true;
  }

  function finish() {
    saveProfile(p);
    markOnboarded();
    onClose(true);
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Set up your career profile"
    >
      <div className="modal onboarding-modal">
        <div className="modal-head">
          <div>
            <div className="onboard-kicker">
              Step {step} of {STEP_COUNT}
            </div>
            <h2>
              {step === 1
                ? 'Tell us about your skills'
                : step === 2
                  ? 'What interests you?'
                  : 'Pick your target career'}
            </h2>
          </div>
          <button className="modal-close" onClick={() => onClose(false)} aria-label="Close">
            <XIcon size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="onboard-progress">
            {[1, 2, 3].map((n) => (
              <span key={n} className={`onboard-dot ${n <= step ? 'on' : ''}`} />
            ))}
          </div>

          {step === 1 && (
            <>
              <p className="onboard-sub">
                We'll use this to personalize your dashboard and prefill the roadmap tool.
              </p>
              <div className="field">
                <label htmlFor="obSkills">Your current skills *</label>
                <textarea
                  id="obSkills"
                  className="textarea"
                  rows={2}
                  value={p.skills}
                  onChange={set('skills')}
                  placeholder="e.g. Python, HTML/CSS, SQL basics, Git"
                />
              </div>
              <div className="chip-row" style={{ marginTop: 10 }}>
                {SKILL_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip ${hasToken(p.skills, s) ? 'active' : ''}`}
                    onClick={() => setP((f) => ({ ...f, skills: toggleInList(f.skills, s) }))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="onboard-sub">Pick a few — or write your own.</p>
              <div className="field">
                <label htmlFor="obInterests">Interests</label>
                <textarea
                  id="obInterests"
                  className="textarea"
                  rows={2}
                  value={p.interests}
                  onChange={set('interests')}
                  placeholder="e.g. Web development, AI / Machine Learning"
                />
              </div>
              <div className="chip-row" style={{ marginTop: 10 }}>
                {INTEREST_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`chip ${hasToken(p.interests, s) ? 'active' : ''}`}
                    onClick={() => setP((f) => ({ ...f, interests: toggleInList(f.interests, s) }))}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="onboard-sub">
                Choose one to start — you can change it anytime from the Dashboard.
              </p>
              <div className="chip-col">
                {CAREER_TARGETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`chip ${p.targetCareer === c ? 'active' : ''}`}
                    onClick={() => setP((f) => ({ ...f, targetCareer: c }))}
                  >
                    {c}
                    {p.targetCareer === c && <span className="chip-check">✓</span>}
                  </button>
                ))}
              </div>
              <div className="field" style={{ marginTop: 14 }}>
                <label htmlFor="obTimeline">Timeline</label>
                <select id="obTimeline" className="select" value={p.timeline} onChange={set('timeline')}>
                  {TIMELINE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && (
            <div className="auth-error" style={{ marginTop: 12 }}>
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          {showSkip && step === 1 && (
            <button className="btn btn-ghost" onClick={() => onClose(false)}>
              Maybe later
            </button>
          )}
          <span style={{ flex: 1 }} />
          {step > 1 && (
            <button
              className="btn btn-ghost"
              onClick={() => {
                setError('');
                setStep((s) => s - 1);
              }}
            >
              Back
            </button>
          )}
          {step < STEP_COUNT ? (
            <button
              className="btn btn-primary"
              disabled={!canContinue()}
              onClick={() => {
                if (!canContinue()) {
                  setError('Please add at least one skill to continue.');
                  return;
                }
                setError('');
                setStep((s) => s + 1);
              }}
            >
              Continue <ArrowRightIcon size={15} />
            </button>
          ) : (
            <button className="btn btn-primary" onClick={finish}>
              <RouteIcon size={15} /> Save my profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
