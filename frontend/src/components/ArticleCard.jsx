import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const CATEGORY_COLORS = {
  Tech: '#2563b8',
  AI: '#7c3aed',
  Backend: '#059669',
  Frontend: '#d97706',
  DevOps: '#dc2626',
  Database: '#0891b2',
  Security: '#be185d',
  Mobile: '#16a34a',
  Other: '#6b7280',
};

const ArticleCard = ({ article }) => {
  const color = CATEGORY_COLORS[article.category] || '#6b7280';
  const dateStr = article.created_at
    ? format(new Date(article.created_at), 'MMM d, yyyy')
    : '';

  return (
    <div className="card fade-up" style={{ padding: 0, overflow: 'hidden' }}>
      {/* Category bar */}
      <div style={{ height: 3, background: color }} />

      <div style={{ padding: '20px 22px 22px' }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 600,
            color,
            textTransform: 'uppercase',
            letterSpacing: '0.07em',
          }}>
            {article.category}
          </span>
          <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{dateStr}</span>
        </div>

        {/* Title */}
        <Link to={`/articles/${article.id}`} style={{ textDecoration: 'none' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 19,
            fontWeight: 700,
            color: 'var(--ink)',
            marginBottom: 10,
            lineHeight: 1.3,
            transition: 'color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--ink)'}
          >
            {article.title}
          </h2>
        </Link>

        {/* Summary */}
        {article.summary && (
          <p style={{
            fontSize: 14,
            color: 'var(--ink-muted)',
            lineHeight: 1.6,
            marginBottom: 14,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {article.summary}
          </p>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {article.tags.slice(0, 4).map(tag => (
              <span key={tag} className="badge badge-tag" style={{ fontSize: 11 }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid var(--paper-dark)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 11,
              fontWeight: 700,
            }}>
              {article.author_name?.[0]?.toUpperCase()}
            </div>
            <span style={{ fontSize: 13, color: 'var(--ink-light)', fontWeight: 500 }}>
              {article.author_name}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
              👁 {article.views || 0}
            </span>
            <Link
              to={`/articles/${article.id}`}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: 'var(--accent)',
                textDecoration: 'none',
              }}
            >
              Read →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
