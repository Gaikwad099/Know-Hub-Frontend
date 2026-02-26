import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { articlesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const CATEGORY_COLORS = {
  Tech: '#2563b8', AI: '#7c3aed', Backend: '#059669', Frontend: '#d97706',
  DevOps: '#dc2626', Database: '#0891b2', Security: '#be185d', Mobile: '#16a34a', Other: '#6b7280',
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArticles = () => {
    setLoading(true);
    articlesAPI.getMy()
      .then(res => setArticles(res.data))
      .catch(() => toast.error('Failed to load your articles'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await articlesAPI.delete(id);
      toast.success('Article deleted');
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch {
      toast.error('Failed to delete article');
    }
  };

  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  return (
    <div className="page-main">
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 32,
        }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              fontWeight: 900,
              color: 'var(--ink)',
              marginBottom: 6,
            }}>My Articles</h1>
            <p style={{ color: 'var(--ink-muted)' }}>
              Welcome back, <strong>{user?.username}</strong> ✦ {user?.email}
            </p>
          </div>
          <Link to="/articles/new" className="btn btn-primary">
            ✏️ New Article
          </Link>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 16,
          marginBottom: 36,
        }}>
          {[
            { label: 'Articles', value: articles.length, icon: '📝' },
            { label: 'Total Views', value: totalViews, icon: '👁' },
            { label: 'Categories', value: new Set(articles.map(a => a.category)).size, icon: '🏷' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}>
              <span style={{ fontSize: 28 }}>{stat.icon}</span>
              <div>
                <div style={{
                  fontSize: 28,
                  fontWeight: 900,
                  fontFamily: 'var(--font-display)',
                  color: 'var(--ink)',
                  lineHeight: 1,
                }}>{stat.value}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 2 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Articles table */}
        {loading ? (
          <div style={{ display: 'grid', placeItems: 'center', height: 200 }}>
            <div className="spinner" style={{ width: 32, height: 32 }} />
          </div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>No articles yet</h3>
            <p style={{ marginTop: 8, marginBottom: 20 }}>Write your first article and share your knowledge!</p>
            <Link to="/articles/new" className="btn btn-primary">✏️ Write First Article</Link>
          </div>
        ) : (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--paper-warm)', borderBottom: '1px solid var(--border)' }}>
                  {['Title', 'Category', 'Tags', 'Views', 'Published', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '12px 16px',
                      textAlign: 'left',
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--ink-muted)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articles.map((article, i) => {
                  const color = CATEGORY_COLORS[article.category] || '#6b7280';
                  return (
                    <tr
                      key={article.id}
                      style={{
                        borderBottom: i < articles.length - 1 ? '1px solid var(--paper-dark)' : 'none',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--paper)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', maxWidth: 280 }}>
                        <Link
                          to={`/articles/${article.id}`}
                          style={{
                            fontWeight: 600,
                            color: 'var(--ink)',
                            textDecoration: 'none',
                            fontSize: 14,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {article.title}
                        </Link>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                        }}>
                          {article.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {article.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="badge badge-tag" style={{ fontSize: 11 }}>
                              #{tag}
                            </span>
                          ))}
                          {article.tags?.length > 2 && (
                            <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>+{article.tags.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--ink-muted)' }}>
                        {article.views || 0}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 12, color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>
                        {format(new Date(article.created_at), 'MMM d, yyyy')}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link
                            to={`/articles/${article.id}`}
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: 12, padding: '4px 10px' }}
                          >View</Link>
                          <Link
                            to={`/articles/${article.id}/edit`}
                            className="btn btn-ghost btn-sm"
                            style={{ fontSize: 12, padding: '4px 10px' }}
                          >Edit</Link>
                          <button
                            onClick={() => handleDelete(article.id, article.title)}
                            className="btn btn-sm"
                            style={{ fontSize: 12, padding: '4px 10px', background: '#fee2e2', color: '#dc2626', border: 'none' }}
                          >Delete</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
