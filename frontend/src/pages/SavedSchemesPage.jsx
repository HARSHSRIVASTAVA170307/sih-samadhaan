import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookmarkIcon,
  LandmarkIcon,
  ExternalLinkIcon,
  TrashIcon,
  ArrowRightIcon,
} from '../components/icons.jsx';
import { getSavedSchemes, removeSavedScheme, logActivity } from '../services/localStore.js';

export default function SavedSchemesPage() {
  const [saved, setSaved] = useState([]);

  useEffect(() => {
    setSaved(getSavedSchemes());
    logActivity('tool', 'Viewed saved schemes', '/government-schemes/saved');
  }, []);

  const remove = (id) => {
    removeSavedScheme(id);
    setSaved(getSavedSchemes());
  };

  return (
    <div className="container" style={{ paddingTop: 32, maxWidth: 860 }}>
      <div className="page-head">
        <div>
          <span className="badge badge-amber">Bookmarks</span>
          <h1 style={{ marginTop: 10 }}>Saved schemes</h1>
          <p className="section-sub">
            Schemes you bookmarked, stored privately in your browser (localStorage) — no
            account needed.
          </p>
        </div>
        <Link to="/government-schemes" className="btn btn-secondary">
          Browse more schemes <ArrowRightIcon size={15} />
        </Link>
      </div>

      {saved.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">
              <BookmarkIcon size={26} />
            </div>
            <h3>No saved schemes yet</h3>
            <p>
              Browse the Government Schemes dashboard and hit <b>Save</b> on the schemes
              relevant to you. They will appear here for quick access.
            </p>
            <Link to="/government-schemes" className="btn btn-primary" style={{ marginTop: 16 }}>
              Explore schemes
            </Link>
          </div>
        </div>
      ) : (
        <div className="saved-list">
          {saved.map((s) => (
            <div key={s.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <span className="feature-icon teal" style={{ width: 42, height: 42, borderRadius: 12 }}>
                  <LandmarkIcon size={20} />
                </span>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 16 }}>{s.name}</h3>
                    <span className="badge badge-gray">{s.category}</span>
                  </div>
                  <div className="scheme-ministry" style={{ marginTop: 4 }}>
                    <LandmarkIcon size={13} /> {s.ministry}
                  </div>
                  <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 8, lineHeight: 1.6 }}>
                    {s.description}
                  </p>
                  <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                    <a className="btn btn-primary btn-sm" href={s.officialLink} target="_blank" rel="noreferrer">
                      Official portal <ExternalLinkIcon size={14} />
                    </a>
                    <Link className="btn btn-secondary btn-sm" to={`/government-schemes?open=${s.id}`}>
                      View details
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => remove(s.id)}>
                      <TrashIcon size={14} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
