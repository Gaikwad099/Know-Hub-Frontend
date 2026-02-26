import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { articlesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  Tech: '#2563b8', AI: '#7c3aed', Backend: '#059669', Frontend: '#d97706',
  DevOps: '#dc2626', Database: '#0891b2', Security: '#be185d', Mobile: '#16a34a', Other: '#6b7280',
};

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    articlesAPI.getById(id)
      .then(res => setArticle(res.data))
      .catch(() => toast.error('Article not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this article permanently?')) return;
    setDeleting(true);
    try {
      await articlesAPI.delete(id);
      toast.success('Article deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete article');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ width: 36, height: 36, margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--ink-muted)' }}>Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="empty-state page-main">
        <div className="empty-state-icon">🔍</div>
        <h3>Article not found</h3>
        <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>← Back to Home</Link>
      </div>
    );
  }

  const color = CATEGORY_COLORS[article.category] || '#6b7280';
  const isAuthor = user?.id === article.author_id;

  return (
    <div className="page-main">
      <div className="container">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ marginBottom: 24, fontSize: 14 }}>
            <Link to="/" style={{ color: 'var(--ink-muted)' }}>Home</Link>
            <span style={{ color: 'var(--border)', margin: '0 8px' }}>/</span>
            <span style={{ color: 'var(--ink)' }}>{article.title}</span>
          </div>

          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <span style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: 100,
              background: `${color}18`,
              color,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
              border: `1px solid ${color}30`,
            }}>
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(26px, 4vw, 42px)',
            fontWeight: 900,
            color: 'var(--ink)',
            lineHeight: 1.15,
            marginBottom: 20,
          }}>
            {article.title}
          </h1>

          {/* Meta row */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingBottom: 20,
            borderBottom: '1px solid var(--border)',
            marginBottom: 32,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: 16, fontWeight: 700,
              }}>
                {article.author_name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
                  {article.author_name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--ink-muted)' }}>
                  {format(new Date(article.created_at), 'MMMM d, yyyy')}
                  {article.updated_at !== article.created_at && (
                    <span> · Updated {format(new Date(article.updated_at), 'MMM d, yyyy')}</span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>👁 {article.views} views</span>

              {isAuthor && (
                <>
                  <Link
                    to={`/articles/${article.id}/edit`}
                    className="btn btn-ghost btn-sm"
                  >✏️ Edit</Link>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn btn-sm"
                    style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
                  >
                    {deleting ? '...' : '🗑 Delete'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Summary callout */}
          {article.summary && (
            <div style={{
              background: 'var(--paper-warm)',
              borderLeft: '4px solid var(--accent)',
              padding: '16px 20px',
              borderRadius: '0 var(--radius-md) var(--radius-md) 0',
              marginBottom: 32,
              fontSize: 16,
              color: 'var(--ink-light)',
              fontStyle: 'italic',
              lineHeight: 1.7,
            }}>
              <span style={{ fontWeight: 700, fontStyle: 'normal', color: 'var(--accent)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                TL;DR
              </span>
              <p style={{ marginTop: 6 }}>{article.summary}</p>
            </div>
          )}

          {/* Article content */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                Tags
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {article.tags.map(tag => (
                  <Link
                    key={tag}
                    to={`/?tag=${tag}`}
                    className="badge badge-tag"
                    style={{ fontSize: 13 }}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Back link */}
          <div style={{ marginTop: 48 }}>
            <Link to="/" className="btn btn-ghost">← Back to all articles</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
