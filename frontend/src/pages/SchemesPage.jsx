import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SearchIcon,
  LandmarkIcon,
  BookmarkIcon,
  ExternalLinkIcon,
  XIcon,
  AlertCircleIcon,
  CalendarIcon,
  InfoIcon,
  CheckCircleIcon,
} from '../components/icons.jsx';
import { fetchSchemes } from '../services/api.js';
import { isSchemeSaved, toggleSavedScheme, logActivity } from '../services/localStore.js';

const CATEGORIES = [
  'Scholarship',
  'Internship',
  'Skill Development',
  'Employment',
  'Entrepreneurship',
  'Students',
];

const CATEGORY_COLORS = {
  Scholarship: 'badge-amber',
  Internship: 'badge-brand',
  'Skill Development': 'badge-violet',
  Employment: 'badge-teal',
  Entrepreneurship: 'badge-green',
  Students: 'badge-gray',
};

function SchemeModal({ scheme, onClose, saved, onSave }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!scheme) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <span className={`badge ${CATEGORY_COLORS[scheme.category] || 'badge-gray'}`}>{scheme.category}</span>
            <h2 style={{ marginTop: 10 }}>{scheme.name}</h2>
            <div className="scheme-ministry" style={{ marginTop: 6 }}>
              <LandmarkIcon size={13} /> {scheme.ministry}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <XIcon size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-section" style={{ borderTop: 'none', paddingTop: 8 }}>
            <h4>Description</h4>
            <p>{scheme.description}</p>
          </div>
          <div className="modal-section">
            <h4>Eligibility</h4>
            <p style={{ display: 'flex', gap: 8 }}>
              <CheckCircleIcon size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: 3 }} />
              {scheme.eligibility}
            </p>
          </div>
          <div className="modal-section">
            <h4>Benefits</h4>
            <p style={{ display: 'flex', gap: 8 }}>
              <InfoIcon size={16} color="var(--brand-600)" style={{ flexShrink: 0, marginTop: 3 }} />
              {scheme.benefits}
            </p>
          </div>
          <div className="modal-section">
            <h4>Deadline / status</h4>
            <p style={{ display: 'flex', gap: 8 }}>
              <CalendarIcon size={16} color="var(--amber)" style={{ flexShrink: 0, marginTop: 3 }} />
              {scheme.deadline}
            </p>
          </div>
          <div className="alert alert-info" style={{ marginTop: 12 }}>
            <InfoIcon size={17} />
            <div>
              Scheme details are summarized for guidance. Always verify current criteria,
              deadlines and application steps on the official government portal.
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <a
            className="btn btn-primary"
            href={scheme.officialLink}
            target="_blank"
            rel="noreferrer"
          >
            Visit Official Portal <ExternalLinkIcon size={15} />
          </a>
          <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={() => onSave(scheme)}>
            <BookmarkIcon size={14} filled={saved} /> {saved ? 'Saved' : 'Save scheme'}
          </button>
        </div>
      </div>
    </div>
  );
}

function SchemeCard({ scheme, onOpen, onSaveToggle, saved }) {
  return (
    <div className="card card-hover scheme-card">
      <div className="scheme-card-top">
        <div>
          <span className={`badge ${CATEGORY_COLORS[scheme.category] || 'badge-gray'}`}>{scheme.category}</span>
          <h3 style={{ marginTop: 8 }}>{scheme.name}</h3>
        </div>
      </div>
      <div className="scheme-ministry">
        <LandmarkIcon size={13} /> {scheme.ministry}
      </div>
      <p className="scheme-desc">{scheme.description}</p>
      <div className="scheme-facts">
        <div className="fact">
          <b>Eligibility:</b>
          <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {scheme.eligibility}
          </span>
        </div>
        <div className="fact">
          <b>Deadline:</b>
          <span>{scheme.deadline}</span>
        </div>
      </div>
      <div className="scheme-card-actions">
        <button className="btn btn-secondary btn-sm" onClick={() => onOpen(scheme)}>
          View Details
        </button>
        <button
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={() => onSaveToggle(scheme)}
          aria-label={saved ? 'Remove from saved' : 'Save scheme'}
        >
          <BookmarkIcon size={14} filled={saved} /> {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export default function SchemesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [debouncedQ, setDebouncedQ] = useState('');

  const page = parseInt(searchParams.get('page') || '1', 10);
  const openId = searchParams.get('open');

  /* debounce search input */
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 350);
    return () => clearTimeout(t);
  }, [q]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchSchemes({ q: debouncedQ, category, page });
      setItems(data.data);
      setMeta(data);
    } catch (e) {
      setError(e.message);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, category, page]);

  useEffect(() => {
    load();
  }, [load]);

  /* sync saved ids */
  useEffect(() => {
    setSavedIds(new Set(items.filter((s) => isSchemeSaved(s.id)).map((s) => s.id)));
  }, [items]);

  /* open scheme from ?open=id (dashboard deep-link) */
  useEffect(() => {
    if (!openId || items.length === 0) return;
    const s = items.find((x) => x.id === openId);
    if (s) setSelected(s);
  }, [openId, items]);

  const closeAndCleanUrl = () => {
    setSelected(null);
    if (openId) {
      searchParams.delete('open');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const onSaveToggle = (scheme) => {
    const nowSaved = toggleSavedScheme(scheme);
    setSavedIds((prev) => {
      const next = new Set(prev);
      nowSaved ? next.add(scheme.id) : next.delete(scheme.id);
      return next;
    });
    if (nowSaved) {
      logActivity('scheme', `Saved scheme: ${scheme.name}`, `/government-schemes?open=${scheme.id}`);
    }
    /* refresh modal save state if open */
    if (selected?.id === scheme.id) {
      setSelected({ ...selected });
    }
  };

  const hasFilters = debouncedQ || category;

  return (
    <div className="container" style={{ paddingTop: 32 }}>
      <div className="page-head">
        <div>
          <span className="badge badge-teal">Government Schemes Dashboard</span>
          <h1 style={{ marginTop: 10 }}>Schemes &amp; programmes for students</h1>
          <p className="section-sub">
            Verified Government of India scholarships, internships and skilling
            programmes — each card links to the official application portal.
          </p>
        </div>
        <a
          className="btn btn-secondary"
          href="https://www.myscheme.gov.in/"
          target="_blank"
          rel="noreferrer"
        >
          myScheme.gov.in <ExternalLinkIcon size={15} />
        </a>
      </div>

      {/* Toolbar */}
      <div className="schemes-toolbar">
        <div className="search-box">
          <span className="icon">
            <SearchIcon size={17} />
          </span>
          <input
            className="input"
            placeholder="Search by name, keyword or ministry…"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              if (page !== 1) searchParams.delete('page');
            }}
            aria-label="Search schemes"
          />
          {q && (
            <button className="clear" onClick={() => setQ('')} aria-label="Clear search">
              <XIcon size={15} />
            </button>
          )}
        </div>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`chip ${category === c ? 'active' : ''}`}
            onClick={() => setCategory(category === c ? '' : c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results meta */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, flexWrap: 'wrap', gap: 8 }}>
        <span style={{ fontSize: 13.5, color: 'var(--muted)' }}>
          {loading
            ? 'Loading schemes…'
            : `${meta.total} scheme${meta.total === 1 ? '' : 's'} found${hasFilters ? ' for your filters' : ''}`}
        </span>
        {hasFilters && !loading && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setQ('');
              setCategory('');
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-error" style={{ marginTop: 14 }}>
          <AlertCircleIcon size={18} />
          <div>
            <b>{error}</b>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Make sure the backend is running on port 4000, then retry.
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="schemes-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card" style={{ padding: 22 }}>
              <div className="skeleton" style={{ width: 90, height: 22, borderRadius: 999 }} />
              <div className="skeleton" style={{ width: '80%', height: 18, marginTop: 14 }} />
              <div className="skeleton" style={{ width: '95%', height: 13, marginTop: 12 }} />
              <div className="skeleton" style={{ width: '60%', height: 13, marginTop: 8 }} />
              <div className="skeleton" style={{ width: '100%', height: 34, marginTop: 18, borderRadius: 11 }} />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="empty-state">
            <div className="icon">
              <LandmarkIcon size={26} />
            </div>
            <h3>No schemes found</h3>
            <p>
              No schemes match “{debouncedQ}”{category ? ` in ${category}` : ''}. Try a
              different keyword — for example “scholarship”, “internship” or a ministry
              name.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="schemes-grid">
            {items.map((s) => (
              <SchemeCard
                key={s.id}
                scheme={s}
                saved={savedIds.has(s.id)}
                onOpen={setSelected}
                onSaveToggle={onSaveToggle}
              />
            ))}
          </div>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28 }}>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page <= 1}
                onClick={() => {
                  searchParams.set('page', String(page - 1));
                  setSearchParams(searchParams);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                ← Previous
              </button>
              <span style={{ alignSelf: 'center', fontSize: 13.5, color: 'var(--muted)' }}>
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                className="btn btn-secondary btn-sm"
                disabled={page >= meta.totalPages}
                onClick={() => {
                  searchParams.set('page', String(page + 1));
                  setSearchParams(searchParams);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {selected && (
        <SchemeModal
          scheme={selected}
          onClose={closeAndCleanUrl}
          saved={savedIds.has(selected.id)}
          onSave={onSaveToggle}
        />
      )}
    </div>
  );
}
