import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';
import { articlesAPI } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Tech', 'AI', 'Backend', 'Frontend', 'DevOps', 'Database', 'Security', 'Mobile', 'Other'];

const HomePage = () => {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;

      const res = await articlesAPI.getAll(params);
      setArticles(res.data.articles);
      setPagination(res.data.pagination);
    } catch {
      toast.error('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.delete('page');
    setSearchParams(next);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = e.target.q.value.trim();
    updateParam('search', q);
  };

  const setPage = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', p);
    setSearchParams(next);
  };

  return (
    <div className="page-main">
      <div className="container">
        {/* Hero */}
        <div style={{
          textAlign: 'center',
          padding: '48px 0 40px',
          borderBottom: '1px solid var(--border)',
          marginBottom: 40,
        }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--accent-pale)',
            color: 'var(--accent)',
            padding: '4px 14px',
            borderRadius: 100,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 16,
            border: '1px solid rgba(201,71,47,0.15)',
          }}>
            ✦ Knowledge Sharing Platform
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: 900,
            color: 'var(--ink)',
            marginBottom: 16,
            lineHeight: 1.1,
          }}>
            Discover & Share<br />
            <em style={{ color: 'var(--accent)' }}>Technical Knowledge</em>
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 17, maxWidth: 480, margin: '0 auto' }}>
            A community-driven platform for developers to write, read, and discover technical articles — enhanced with AI.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, maxWidth: 600, margin: '0 auto' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <span style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 16,
                color: 'var(--ink-muted)',
              }}>🔍</span>
              <input
                name="q"
                defaultValue={search}
                className="form-input"
                placeholder="Search articles by title, content, or tags..."
                style={{ paddingLeft: 40 }}
              />
            </div>
            <button type="submit" className="btn btn-primary">Search</button>
            {search && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => updateParam('search', '')}
              >
                ✕ Clear
              </button>
            )}
          </div>
        </form>

        {/* Category Filter */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          marginBottom: 36,
          justifyContent: 'center',
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => updateParam('category', cat)}
              className="btn btn-sm"
              style={{
                background: (category === cat || (cat === 'All' && !category))
                  ? 'var(--accent)'
                  : 'white',
                color: (category === cat || (cat === 'All' && !category))
                  ? 'white'
                  : 'var(--ink-light)',
                border: '1px solid var(--border)',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results info */}
        {(search || category) && !loading && (
          <div style={{ marginBottom: 20, color: 'var(--ink-muted)', fontSize: 14 }}>
            {pagination.total} result{pagination.total !== 1 ? 's' : ''}
            {search && ` for "${search}"`}
            {category && ` in ${category}`}
          </div>
        )}

        {/* Articles Grid */}
        {loading ? (
          <div style={{ display: 'grid', placeItems: 'center', height: 300 }}>
            <div style={{ textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 12px', width: 32, height: 32 }} />
              <p style={{ color: 'var(--ink-muted)' }}>Loading articles...</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No articles found</h3>
            <p style={{ marginTop: 8 }}>
              {search ? `No articles match "${search}"` : 'Be the first to write something!'}
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 24,
              marginBottom: 40,
            }}>
              {articles.map((article, i) => (
                <div key={article.id} style={{ animationDelay: `${i * 0.05}s` }}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                >← Prev</button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    className="btn btn-sm"
                    onClick={() => setPage(p)}
                    style={{
                      background: p === page ? 'var(--accent)' : 'white',
                      color: p === page ? 'white' : 'var(--ink-light)',
                      border: '1px solid var(--border)',
                    }}
                  >{p}</button>
                ))}

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= pagination.totalPages}
                >Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
