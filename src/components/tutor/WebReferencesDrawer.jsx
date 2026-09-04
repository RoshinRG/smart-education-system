import React, { useState } from 'react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';

export default function WebReferencesDrawer({ references = [], isModal = false, onClose }) {
  const [filterDomain, setFilterDomain] = useState('all');
  const [copiedId, setCopiedId] = useState(null);

  if (!references || references.length === 0) {
    return (
      <div className="empty-references">
        <p className="text-subtle text-sm">No web references gathered yet.</p>
      </div>
    );
  }

  const domains = ['all', ...new Set(references.map((r) => r.domain || r.source))];

  const filtered = filterDomain === 'all'
    ? references
    : references.filter((r) => (r.domain || r.source) === filterDomain);

  const handleCopyCitation = (ref) => {
    const citationText = `[Web Reference] "${ref.title}" - ${ref.source} (${ref.url})`;
    navigator.clipboard?.writeText(citationText);
    setCopiedId(ref.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getSourceIcon = (source = '') => {
    const s = source.toLowerCase();
    if (s.includes('mit')) return '🏛️';
    if (s.includes('khan')) return '🌱';
    if (s.includes('wiki')) return '📖';
    if (s.includes('mdn') || s.includes('mozilla')) return '🦖';
    if (s.includes('stanford')) return '🌲';
    if (s.includes('arxiv')) return '📑';
    if (s.includes('nature')) return '🔬';
    if (s.includes('geeks')) return '💻';
    return '🌐';
  };

  const content = (
    <div className={`web-references-container ${isModal ? 'is-modal-view' : ''}`}>
      {isModal && (
        <div className="references-filter-row mb-3">
          <label className="text-sm font-semibold text-subtle mr-2">Filter by Source:</label>
          <div className="filter-chips">
            {domains.map((dom) => (
              <button
                key={dom}
                className={`filter-chip ${filterDomain === dom ? 'active' : ''}`}
                onClick={() => setFilterDomain(dom)}
              >
                {dom === 'all' ? 'All Sources' : dom}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="references-cards-grid">
        {filtered.map((ref) => (
          <div key={ref.id || ref.url} className="ref-card">
            <div className="ref-card-header">
              <span className="ref-source-badge">
                <span className="ref-source-icon">{getSourceIcon(ref.source)}</span>
                <strong>{ref.source}</strong>
              </span>
              {ref.badge && (
                <span className="badge badge-purple text-xs">{ref.badge}</span>
              )}
            </div>

            <h4 className="ref-card-title">
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ref-link"
              >
                {ref.title} <span className="external-arrow">↗</span>
              </a>
            </h4>

            <p className="ref-card-snippet">{ref.snippet}</p>

            <div className="ref-card-footer">
              <span className="ref-domain-text">{ref.domain || 'External Educational Source'}</span>
              <button
                className="btn-copy-citation"
                onClick={() => handleCopyCitation(ref)}
                title="Copy academic citation"
              >
                {copiedId === ref.id ? '✓ Citation Copied' : '📋 Copy Citation'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <Card className="references-modal-card">
        <div className="modal-header-banner mb-3">
          <div className="d-flex justify-between align-center">
            <div>
              <h3 className="card-title">📚 Session Reference Hub & Bibliography</h3>
              <p className="card-subtitle">
                Verified educational references and web sources gathered during this AI tutoring session ({references.length} sources)
              </p>
            </div>
          </div>
        </div>
        {content}
      </Card>
    );
  }

  return content;
}
