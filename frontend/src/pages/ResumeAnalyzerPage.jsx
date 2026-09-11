import { useRef, useState, useEffect } from 'react';
import {
  UploadIcon,
  FileScanIcon,
  TrashIcon,
  CheckIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  InfoIcon,
  TargetIcon,
  ArrowRightIcon,
  BriefcaseIcon,
  XIcon,
  ExternalLinkIcon,
  SearchIcon,
} from '../components/icons.jsx';
import { analyzeResume, fetchTargetJobs } from '../services/api.js';
import { logActivity } from '../services/localStore.js';

const LOADING_STEPS = [
  'Uploading resume securely',
  'Extracting text from PDF',
  'Comparing against job description',
  'Scoring skills & experience',
  'Preparing suggestions',
];

const EXAMPLE_JD = `We are hiring a Junior Frontend Developer with hands-on knowledge of HTML, CSS, JavaScript, React and REST API integration. The candidate should be able to build responsive UIs, debug issues, use Git for collaboration, and understand basic web performance. Exposure to TypeScript, testing libraries or cloud deployment is a plus.`;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ScoreDial({ score }) {
  const color = score >= 70 ? 'var(--green)' : score >= 45 ? 'var(--amber)' : 'var(--rose)';
  return (
    <div
      className="score-dial"
      style={{ background: `conic-gradient(${color} 0 ${score}%, var(--line-soft) ${score}% 100%)` }}
    >
      <div className="inner">
        <div className="num" style={{ color }}>
          {score}
        </div>
        <div className="lbl">/ 100</div>
      </div>
    </div>
  );
}

function ListCard({ title, icon, tone, items, empty }) {
  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 15.5, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: tone === 'good' ? 'var(--green)' : tone === 'bad' ? 'var(--rose)' : 'var(--brand-600)' }}>
          {icon}
        </span>
        {title}
      </h3>
      {items?.length ? (
        <ul className={`check-list ${tone === 'good' ? 'good' : tone === 'bad' ? 'bad' : 'neutral'}`} style={{ marginTop: 12, padding: 0 }}>
          {items.map((it, i) => (
            <li key={i}>
              <span className="li-icon">
                {tone === 'good' ? <CheckCircleIcon size={16} /> : tone === 'bad' ? <AlertCircleIcon size={16} /> : <InfoIcon size={16} />}
              </span>
              {it}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: 'var(--faint)', fontSize: 13.5, marginTop: 10 }}>{empty}</p>
      )}
    </div>
  );
}

function CompanyPicker({ open, onClose, onPick }) {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchTargetJobs(q)
      .then((d) => {
        setJobs(d.data);
        setError('');
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <span className="badge badge-brand">
              <BriefcaseIcon size={13} /> Target companies
            </span>
            <h2 style={{ marginTop: 10 }}>Pick a job description</h2>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 4 }}>
              Preloaded fresher/early-career job descriptions from 12 top companies.
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <XIcon size={16} />
          </button>
        </div>
        <div style={{ padding: '14px 24px 0' }}>
          <div className="search-box">
            <span className="icon">
              <SearchIcon size={16} />
            </span>
            <input
              className="input"
              placeholder="Search company, role or skill…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
            />
          </div>
        </div>
        <div className="job-picker-grid">
          {loading && <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--muted)', padding: 20 }}>Loading companies…</div>}
          {error && <div className="alert alert-error" style={{ gridColumn: '1 / -1' }}>{error}</div>}
          {!loading && !error && jobs.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--muted)', padding: 20 }}>
              No companies match “{q}”.
            </div>
          )}
          {jobs.map((j) => (
            <button
              key={j.id}
              className="job-card"
              onClick={() => {
                onPick(j);
                onClose();
              }}
            >
              <span className="logo">{j.company?.[0] || 'C'}</span>
              <span style={{ minWidth: 0 }}>
                <span className="company">{j.company}</span>
                <div className="role">{j.role}</div>
                <div className="loc">{j.location}</div>
                <span className="tags">
                  {(j.tags || []).slice(0, 4).map((t) => (
                    <span className="tag" key={t}>{t}</span>
                  ))}
                </span>
              </span>
            </button>
          ))}
        </div>
        <div className="modal-footer" style={{ paddingTop: 0 }}>
          <span style={{ fontSize: 12.5, color: 'var(--faint)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <InfoIcon size={14} /> Descriptions are representative — always check the official careers page before applying.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ResumeAnalyzerPage() {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [jd, setJd] = useState('');
  const [loading, setLoading] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showRaw, setShowRaw] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [targetJob, setTargetJob] = useState(null);
  const inputRef = useRef(null);

  const pickFile = (f) => {
    setError('');
    if (!f) return;
    if (f.type && f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Unsupported file type. Please upload a PDF resume (.pdf).');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum resume size is 10 MB.');
      return;
    }
    setFile(f);
    setResult(null);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const runAnalysis = async () => {
    if (!file) {
      setError('Please upload your resume PDF first.');
      return;
    }
    if (!jd.trim() || jd.trim().length < 40) {
      setError('Please paste a fuller job description (at least a few sentences).');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    setStepIdx(0);
    const timer = setInterval(() => setStepIdx((i) => Math.min(i + 1, LOADING_STEPS.length - 1)), 3500);
    try {
      const data = await analyzeResume(file, jd);
      setResult(data);
      logActivity('tool', 'Resume analyzed with AI', '/resume-analyzer');
    } catch (e) {
      setError(e.message);
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setJd('');
    setResult(null);
    setError('');
    setShowRaw(false);
    setTargetJob(null);
  };

  const recLabel = {
    'apply-now': { text: 'Apply now', cls: 'badge-green' },
    'apply-after-edits': { text: 'Apply after edits', cls: 'badge-amber' },
    'build-more-evidence': { text: 'Build more evidence first', cls: 'badge-rose' },
    review: { text: 'Review suggested edits', cls: 'badge-brand' },
  }[result?.recommendation || 'review'];

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <div className="page-head">
        <div>
          <span className="badge badge-brand">AI Resume Analyzer</span>
          <h1 style={{ marginTop: 10 }}>Resume ↔ Job Description match analysis</h1>
          <p className="section-sub">
            Powered by the <b>AI Resume Match Analyzer</b> engine (Google Gemini). Your
            resume is parsed into text and compared against the job description you
            provide — nothing is stored.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: 18 }}>
          <AlertCircleIcon size={18} />
          <div>
            <b>{error}</b>
            {error.includes('not running') && (
              <div style={{ fontSize: 13, marginTop: 4 }}>
                The analyzer is a separate Python service. From the project root run:{' '}
                <code>cd resume-analyzer/backend && uvicorn app.main:app --port 8001</code> (see
                README for first-time setup).
              </div>
            )}
          </div>
        </div>
      )}

      <div className="resume-layout">
        {/* ---------------- Input column ---------------- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="card card-pad">
            <h3 style={{ fontSize: 15.5, marginBottom: 14 }}>1 · Upload resume</h3>

            {!file ? (
              <div
                className={`dropzone ${dragOver ? 'dragover' : ''}`}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
              >
                <div className="icon">
                  <UploadIcon size={24} />
                </div>
                <h3>Drag &amp; drop your resume here</h3>
                <p>or click to browse from your device</p>
                <div className="formats">
                  <span className="badge badge-gray">PDF only</span>
                  <span className="badge badge-gray">Max 10 MB</span>
                  <span className="badge badge-gray">Text-based PDF</span>
                </div>
              </div>
            ) : (
              <div className="file-pill">
                <span className="icon">
                  <FileScanIcon size={20} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="name">{file.name}</div>
                  <div className="size">{formatSize(file.size)} · Ready to analyze</div>
                </div>
                <button
                  className="remove"
                  onClick={() => setFile(null)}
                  disabled={loading}
                  aria-label="Remove file"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              hidden
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </div>

          <div className="card card-pad">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 15.5 }}>2 · Target job description</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => setPickerOpen(true)} disabled={loading}>
                <BriefcaseIcon size={14} /> Browse companies
              </button>
            </div>
            {targetJob && (
              <div className="target-pill">
                <BriefcaseIcon size={13} /> {targetJob.company} · {targetJob.role}
                <button onClick={() => setTargetJob(null)} aria-label="Remove target company">
                  <XIcon size={11} />
                </button>
              </div>
            )}
            <div className="field">
              <textarea
                className="textarea"
                rows={8}
                placeholder="Paste the full job description or internship posting you want to target…"
                value={jd}
                disabled={loading}
                onChange={(e) => setJd(e.target.value)}
              />
              <span className="hint">
                Tip: include required skills, tools and responsibilities for the most
                accurate match score.
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setTargetJob(null);
                  setJd(EXAMPLE_JD);
                }}
                disabled={loading}
              >
                <InfoIcon size={14} /> Use example job description
              </button>
              {targetJob && (
                <a
                  className="btn btn-ghost btn-sm"
                  href={targetJob.officialCareersLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  {targetJob.company} careers <ExternalLinkIcon size={13} />
                </a>
              )}
            </div>
          </div>

          <button className="btn btn-primary btn-lg btn-block" onClick={runAnalysis} disabled={loading || !file}>
            {loading ? (
              <>
                <span className="spinner" /> Analyzing…
              </>
            ) : (
              <>
                <FileScanIcon size={18} /> Analyze Resume
              </>
            )}
          </button>
        </div>

        {/* ---------------- Results column ---------------- */}
        <div>
          {loading && (
            <div className="card card-pad analyzing">
              <div className="ring" />
              <h3>AI analysis in progress</h3>
              <p>Gemini is reading your resume against the job description. This usually takes 10-40 seconds.</p>
              <div className="analysis-steps">
                {LOADING_STEPS.map((s, i) => (
                  <div key={s} className={`step ${i < stepIdx ? 'done' : i === stepIdx ? 'active' : ''}`}>
                    <span className="bullet">{i < stepIdx ? <CheckIcon size={13} /> : i + 1}</span>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="card card-pad">
              <div className="empty-state" style={{ padding: '48px 20px' }}>
                <div className="icon">
                  <TargetIcon size={26} />
                </div>
                <h3>Your results dashboard will appear here</h3>
                <p>
                  You will get a match score, strong matches, skill gaps, ATS keyword
                  suggestions, resume improvements and a final recommendation.
                </p>
              </div>
            </div>
          )}

          {!loading && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Score hero */}
              <div className="card card-pad">
                <div className="result-hero">
                  {result.score !== null && result.score !== undefined ? (
                    <ScoreDial score={result.score} />
                  ) : (
                    <div className="score-dial" style={{ background: 'var(--line-soft)' }}>
                      <div className="inner">
                        <div className="num" style={{ color: 'var(--muted)' }}>—</div>
                        <div className="lbl">score</div>
                      </div>
                    </div>
                  )}
                  <div className="result-hero-info">
                    <h2>Match Analysis</h2>
                    {result.summary && (
                      <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6, lineHeight: 1.6 }}>
                        {result.summary}
                      </p>
                    )}
                    <div className="reco-row">
                      <span className={`badge ${recLabel.cls}`}>
                        <CheckCircleIcon size={13} /> {recLabel.text}
                      </span>
                      <span className="badge badge-gray">Gemini-powered</span>
                      <span className="badge badge-gray">{result.strongMatches?.length || 0} matches found</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & gaps */}
              <div className="dash-grid" style={{ marginTop: 0 }}>
                <ListCard
                  title="Strong matches"
                  tone="good"
                  icon={<CheckCircleIcon size={17} />}
                  items={result.strongMatches}
                  empty="No strong matches were identified for this role."
                />
                <ListCard
                  title="Skill gaps & weak areas"
                  tone="bad"
                  icon={<AlertCircleIcon size={17} />}
                  items={result.missingOrWeakAreas}
                  empty="No missing areas identified."
                />
              </div>

              {/* Keywords & suggestions */}
              <div className="dash-grid" style={{ marginTop: 0 }}>
                <ListCard
                  title="ATS keywords to add"
                  tone="neutral"
                  icon={<InfoIcon size={17} />}
                  items={result.atsKeywords}
                  empty="No extra keywords suggested."
                />
                <ListCard
                  title="Improvement suggestions"
                  tone="neutral"
                  icon={<InfoIcon size={17} />}
                  items={result.improvementSuggestions}
                  empty="No suggestions available."
                />
              </div>

              {/* Improved bullets + recommendation */}
              {result.improvedBullets?.length > 0 && (
                <div className="card card-pad">
                  <h3 style={{ fontSize: 15.5 }}>Improved resume bullets</h3>
                  <p className="section-sub" style={{ marginTop: 4 }}>
                    Rewritten to better match this role — without exaggerating your experience.
                  </p>
                  <ul className="check-list neutral" style={{ marginTop: 12, padding: 0 }}>
                    {result.improvedBullets.map((b, i) => (
                      <li key={i}>
                        <span className="li-icon">
                          <ArrowRightIcon size={15} />
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.finalRecommendation && (
                <div className="alert alert-info">
                  <TargetIcon size={18} />
                  <div>
                    <b>Final recommendation: </b>
                    {result.finalRecommendation}
                  </div>
                </div>
              )}

              {/* Raw report */}
              <div className="card card-pad">
                <div className="report-toggle">
                  <button className="btn btn-secondary btn-sm" onClick={() => setShowRaw((v) => !v)}>
                    {showRaw ? 'Hide full AI report' : 'View full AI report'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={reset}>
                    Analyze another resume
                  </button>
                </div>
                {showRaw && <pre className="raw-report">{result.rawReport}</pre>}
              </div>
            </div>
          )}
        </div>
      </div>

      <CompanyPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(j) => {
          setTargetJob(j);
          setJd(j.jobDescription);
          setError('');
          logActivity('tool', `Target set: ${j.company}`, '/resume-analyzer');
        }}
      />
    </div>
  );
}
