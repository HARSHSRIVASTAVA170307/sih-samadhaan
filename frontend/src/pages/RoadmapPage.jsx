import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  RouteIcon,
  SparkIcon,
  TargetIcon,
  ClockIcon,
  BookIcon,
  VideoIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  GradIcon,
  ExternalLinkIcon,
  TrophyIcon,
} from '../components/icons.jsx';
import { generateRoadmap, fetchClarity } from '../services/api.js';
import { logActivity } from '../services/localStore.js';
import { toRoadmapForm } from '../services/profile.js';

const EDUCATION_OPTIONS = [
  'Class 10',
  'Class 12',
  'Diploma',
  'Bachelors (B.Tech / B.E. / BSc / BCA)',
  'Masters (M.Tech / MSc / MCA)',
  'Other',
];

const CAREER_SUGGESTIONS = [
  'Full Stack Developer',
  'Data Scientist',
  'AI / ML Engineer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'UI/UX Designer',
  'Cloud Engineer',
  'Mobile App Developer',
];

const RESOURCE_ICONS = {
  video: <VideoIcon size={13} />,
  course: <BookIcon size={13} />,
  documentation: <BookIcon size={13} />,
  project: <BriefcaseIcon size={13} />,
};

function ClarityMeter({ clarity }) {
  const color =
    clarity.clarity_level === 'focused' ? 'var(--green)' : clarity.clarity_level === 'narrowing' ? 'var(--brand-600)' : 'var(--amber)';
  return (
    <div className="card clarity-meter" style={{ marginTop: 14 }}>
      <div className="row">
        <span style={{ fontSize: 13, fontWeight: 600 }}>Career clarity</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>
          {clarity.clarity_score}/100 · {clarity.clarity_level}
        </span>
      </div>
      <div className="progress-track" style={{ margin: '10px 0 8px' }}>
        <div className="progress-fill" style={{ width: `${clarity.clarity_score}%`, background: color }} />
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{clarity.message}</p>
    </div>
  );
}

function ProfileForm({ onGenerated }) {
  const location = useLocation();
  const [form, setForm] = useState(() => {
    const defaults = {
      name: '',
      education: 'Bachelors (B.Tech / B.E. / BSc / BCA)',
      skills: '',
      interests: '',
      goals: '',
      experience: '',
      time_per_week: 10,
      learning_pace: 'medium',
    };
    /* Arriving from the Dashboard profile card (or onboarding) — prefill */
    return location.state?.prefill ? { ...defaults, ...toRoadmapForm() } : defaults;
  });
  const [clarity, setClarity] = useState(null);
  const [clarityAnswers, setClarityAnswers] = useState({
    has_career_in_mind: 'somewhat',
    familiarity_with_paths: 'somewhat',
    primary_goal: 'internship',
  });
  const [loading, setLoading] = useState(false);
  const [clarityLoading, setClarityLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const checkClarity = async () => {
    setClarityLoading(true);
    try {
      const data = await fetchClarity(clarityAnswers);
      setClarity(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setClarityLoading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await generateRoadmap({ ...form, clarity_score: clarity?.clarity_score });
      onGenerated(data);
      logActivity('tool', `Roadmap generated → ${data.career_decision?.career}`, '/career-roadmap');
    } catch (e2) {
      setError(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="card card-pad">
        <h3 style={{ fontSize: 15.5, marginBottom: 14 }}>Your profile</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label>Name</label>
            <input className="input" placeholder="e.g. Priya Sharma" value={form.name} onChange={set('name')} />
          </div>
          <div className="field">
            <label>Education level</label>
            <select className="select" value={form.education} onChange={set('education')}>
              {EDUCATION_OPTIONS.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Current skills</label>
            <input
              className="input"
              placeholder="e.g. Python, HTML, CSS, SQL basics"
              value={form.skills}
              onChange={set('skills')}
            />
            <span className="hint">Comma-separated — include tools and frameworks too.</span>
          </div>
          <div className="field">
            <label>Interests</label>
            <input
              className="input"
              placeholder="e.g. Web development, Machine learning"
              value={form.interests}
              onChange={set('interests')}
            />
          </div>
          <div className="field">
            <label>Target career / goal</label>
            <input
              className="input"
              placeholder="e.g. Become a Data Scientist in 12 months"
              value={form.goals}
              onChange={set('goals')}
            />
            <div className="skill-tags" style={{ marginTop: 8 }}>
              {CAREER_SUGGESTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  className="chip"
                  style={{ fontSize: 12, padding: '4px 10px' }}
                  onClick={() => setForm((f) => ({ ...f, goals: c }))}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <label>Experience (optional)</label>
            <input
              className="input"
              placeholder="e.g. 6-month internship at a startup"
              value={form.experience}
              onChange={set('experience')}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field">
              <label>Learning hours / week</label>
              <input
                className="input"
                type="number"
                min={1}
                max={40}
                value={form.time_per_week}
                onChange={set('time_per_week')}
              />
            </div>
            <div className="field">
              <label>Learning pace</label>
              <select className="select" value={form.learning_pace} onChange={set('learning_pace')}>
                <option value="slow">Slow & steady</option>
                <option value="medium">Medium</option>
                <option value="fast">Fast / intensive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick clarity check */}
      <div className="card card-pad">
        <h3 style={{ fontSize: 15.5, marginBottom: 4 }}>Quick clarity check</h3>
        <p className="section-sub" style={{ marginTop: 2, fontSize: 13 }}>
          Optional — helps the agent decide between exploring many paths or optimizing one.
        </p>
        <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
          <select
            className="select"
            value={clarityAnswers.has_career_in_mind}
            onChange={(e) => setClarityAnswers((a) => ({ ...a, has_career_in_mind: e.target.value }))}
          >
            <option value="yes">I have a specific career in mind</option>
            <option value="somewhat">I have some idea</option>
            <option value="no">I'm still exploring</option>
          </select>
          <select
            className="select"
            value={clarityAnswers.familiarity_with_paths}
            onChange={(e) => setClarityAnswers((a) => ({ ...a, familiarity_with_paths: e.target.value }))}
          >
            <option value="very">Very familiar with tech career paths</option>
            <option value="somewhat">Somewhat familiar</option>
            <option value="not_at_all">Not familiar at all</option>
          </select>
          <select
            className="select"
            value={clarityAnswers.primary_goal}
            onChange={(e) => setClarityAnswers((a) => ({ ...a, primary_goal: e.target.value }))}
          >
            <option value="full_time_job">Goal: full-time job</option>
            <option value="internship">Goal: internship</option>
            <option value="learning">Goal: learning new skills</option>
            <option value="exploring">Goal: exploring options</option>
          </select>
          <button type="button" className="btn btn-secondary btn-sm" onClick={checkClarity} disabled={clarityLoading}>
            <SparkIcon size={14} /> {clarityLoading ? 'Scoring…' : 'Score my clarity'}
          </button>
        </div>
        {clarity && <ClarityMeter clarity={clarity} />}
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircleIcon size={18} />
          <div>
            <b>{error}</b>
            {error.includes('GROQ_API_KEY') && (
              <div style={{ fontSize: 13, marginTop: 4 }}>
                Add your Groq API key to <code>backend/.env</code> (see README) and restart the
                backend.
              </div>
            )}
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={loading}>
        {loading ? (
          <>
            <span className="spinner" /> Agent is planning your career…
          </>
        ) : (
          <>
            <RouteIcon size={18} /> Generate My Roadmap
          </>
        )}
      </button>
      {loading && (
        <p style={{ fontSize: 12.5, color: 'var(--faint)', textAlign: 'center' }}>
          The SkillRoute agent analyzes your profile, evaluates multiple careers and builds
          real resource links — this takes 15-60 seconds.
        </p>
      )}
    </form>
  );
}

function RoadmapResult({ data, onReset }) {
  const decision = data.career_decision || {};
  const roadmapData = data.learning_roadmap || {};
  const phases = roadmapData.roadmap || [];
  const [completed, setCompleted] = useState(() => new Set());

  const togglePhase = (i) =>
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const pct = phases.length ? Math.round((completed.size / phases.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Career decision */}
      <div className="card card-pad">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <span className="badge badge-violet">
              <TrophyIcon size={13} /> AI Career Decision
            </span>
            <h2 style={{ fontSize: 24, marginTop: 10 }}>{decision.career}</h2>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={onReset}>
            New roadmap
          </button>
        </div>
        {decision.reasoning && (
          <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.65, marginTop: 10 }}>
            {decision.reasoning}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginTop: 18 }}>
          {[
            ['Confidence', `${decision.confidence ?? '—'}%`, 'var(--brand-600)'],
            ['Skill match', `${decision.skill_match_percentage ?? '—'}%`, 'var(--violet)'],
            ['Market readiness', `${decision.market_readiness ?? '—'}%`, 'var(--teal)'],
            ['Job-ready in', decision.time_to_job_ready || '—', 'var(--amber)'],
          ].map(([label, val, color]) => (
            <div key={label} style={{ background: 'var(--line-soft)', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'var(--font-display)', marginTop: 2 }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginTop: 18 }}>
          <div>
            <h4 style={{ fontSize: 13, color: 'var(--green)', display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'var(--font-body)' }}>
              <CheckCircleIcon size={14} /> Key strengths
            </h4>
            <div className="skill-tags" style={{ marginTop: 8 }}>
              {(decision.key_strengths || []).map((s) => (
                <span className="skill-tag" key={s}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, color: 'var(--amber)', display: 'flex', gap: 6, alignItems: 'center', fontFamily: 'var(--font-body)' }}>
              <AlertCircleIcon size={14} /> Skill gaps to close
            </h4>
            <div className="skill-tags" style={{ marginTop: 8 }}>
              {(decision.skill_gaps || []).map((s) => (
                <span className="skill-tag gap" key={s}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="card card-pad">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ fontSize: 15.5 }}>Your progress</h3>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--brand-600)' }}>
            {completed.size} / {phases.length} phases · {pct}%
          </span>
        </div>
        <div className="progress-track" style={{ marginTop: 12 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <p style={{ fontSize: 12.5, color: 'var(--faint)', marginTop: 8 }}>
          Tick off a phase below when you finish it (progress is tracked for this session).
        </p>
      </div>

      {/* Timeline */}
      <div>
        <h3 style={{ fontSize: 17, marginBottom: 16 }}>Learning roadmap · {roadmapData.duration_months || '?'} months</h3>
        <div className="timeline">
          {phases.map((phase, i) => {
            const done = completed.has(i);
            return (
              <div key={i} className={`timeline-phase ${done ? 'completed' : ''}`}>
                <span className="node" />
                <div className="card phase-card">
                  <div className="phase-head">
                    <div>
                      <div className="phase-title">
                        {phase.phase || `Phase ${i + 1}`}
                        {done && <span className="badge badge-green" style={{ marginLeft: 8 }}>Completed</span>}
                      </div>
                      <div className="phase-meta">
                        {phase.duration && (
                          <span className="badge badge-gray">
                            <ClockIcon size={12} /> {phase.duration}
                          </span>
                        )}
                        {phase.difficulty && (
                          <span className="badge badge-brand">{phase.difficulty}</span>
                        )}
                      </div>
                    </div>
                    <button
                      className={`save-btn ${done ? 'saved' : ''}`}
                      onClick={() => togglePhase(i)}
                      style={done ? { background: 'var(--green-100)', borderColor: 'var(--green)', color: 'var(--green)' } : {}}
                    >
                      <CheckCircleIcon size={14} /> {done ? 'Done' : 'Mark done'}
                    </button>
                  </div>

                  {phase.focus_skills?.length > 0 && (
                    <div className="skill-tags" style={{ marginTop: 12 }}>
                      {phase.focus_skills.map((s) => (
                        <span className="skill-tag" key={s}>{s}</span>
                      ))}
                    </div>
                  )}

                  {phase.outcomes?.length > 0 && (
                    <div className="phase-outcomes">
                      <b>Outcomes:</b> {phase.outcomes.join(' · ')}
                    </div>
                  )}

                  {(phase.milestones || []).map((m, j) => (
                    <div className="milestone" key={j}>
                      <div className="milestone-head">
                        <h5>{m.name}</h5>
                        {m.estimated_hours && (
                          <span className="badge badge-gray">
                            <ClockIcon size={12} /> {m.estimated_hours} hrs
                          </span>
                        )}
                      </div>
                      {m.description && <p>{m.description}</p>}
                      {(m.resources || []).length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          {m.resources.map((r, k) => (
                            <div className="resource-row" key={k}>
                              <span className="rt">{RESOURCE_ICONS[r.type] || <BookIcon size={13} />}</span>
                              <a href={r.url} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-600)', fontWeight: 500 }}>
                                {r.title}
                              </a>
                              <span className="dur">{r.duration}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alternatives */}
      {decision.alternatives?.length > 0 && (
        <div className="card card-pad">
          <h3 style={{ fontSize: 15.5 }}>
            <GradIcon size={16} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} />
            Other careers the agent considered
          </h3>
          <div className="dash-grid" style={{ marginTop: 14 }}>
            {decision.alternatives.map((alt) => (
              <div key={alt.career} style={{ border: '1px solid var(--line-soft)', borderRadius: 14, padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b style={{ fontSize: 14 }}>{alt.career}</b>
                  <span className="badge badge-brand">{alt.match_score}% match</span>
                </div>
                {alt.reason && <p style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 6, lineHeight: 1.55 }}>{alt.reason}</p>}
                {alt.rejection_reason && (
                  <p style={{ fontSize: 12, color: 'var(--faint)', marginTop: 4 }}>
                    Not chosen: {alt.rejection_reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function RoadmapPage() {
  const [result, setResult] = useState(null);

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <div className="page-head">
        <div>
          <span className="badge badge-violet">Personalized Career Roadmap</span>
          <h1 style={{ marginTop: 10 }}>Your AI-planned path to the target career</h1>
          <p className="section-sub">
            Powered by <b>SkillRoute</b> — an AI career agent that decides your best-fit
            career and builds a time-bound learning roadmap with free, real resources for
            every milestone.
          </p>
        </div>
      </div>

      <div className="roadmap-layout">
        <ProfileForm onGenerated={setResult} />
        <div>
          {result ? (
            <RoadmapResult data={result} onReset={() => setResult(null)} />
          ) : (
            <div className="card card-pad">
              <div className="empty-state" style={{ padding: '48px 20px' }}>
                <div className="icon">
                  <RouteIcon size={26} />
                </div>
                <h3>Your roadmap will appear here</h3>
                <p>
                  Fill in your profile and generate. You'll get a career decision with
                  confidence scores, phased learning stages, free resources, and
                  alternative careers considered by the agent.
                </p>
                <div className="about-flow" style={{ justifyContent: 'center', marginTop: 18 }}>
                  <span className="flow-pill"><TargetIcon size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> Profile</span>
                  <span className="flow-arrow">→</span>
                  <span className="flow-pill">Career decision</span>
                  <span className="flow-arrow">→</span>
                  <span className="flow-pill"><ExternalLinkIcon size={13} style={{ display: 'inline', verticalAlign: '-2px' }} /> Phased roadmap</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
