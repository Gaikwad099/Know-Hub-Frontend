import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RichEditor from '../components/RichEditor';
import { articlesAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Tech', 'AI', 'Backend', 'Frontend', 'DevOps', 'Database', 'Security', 'Mobile', 'Other'];

const ArticleFormPage = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', content: '', category: 'Tech', tags: '', summary: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiPanel, setAiPanel] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      articlesAPI.getById(id).then(res => {
        const a = res.data;
        setForm({
          title: a.title,
          content: a.content,
          category: a.category,
          tags: a.tags?.join(', ') || '',
          summary: a.summary || '',
        });
      }).catch(() => toast.error('Failed to load article')).finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.content || form.content === '<p></p>') {
      toast.error('Please add some content');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (isEdit) {
        await articlesAPI.update(id, payload);
        toast.success('Article updated!');
        navigate(`/articles/${id}`);
      } else {
        const res = await articlesAPI.create(payload);
        toast.success('Article published! 🎉');
        navigate(`/articles/${res.data.id}`);
      }
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Failed to save';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // AI: Improve writing
  const handleImprove = async (mode) => {
    if (!form.content) { toast.error('Write some content first'); return; }
    setAiLoading(true);
    setAiResult('');
    try {
      // Strip HTML for AI
      const tmp = document.createElement('div');
      tmp.innerHTML = form.content;
      const plainText = tmp.textContent;

      const res = await aiAPI.improve(plainText, mode);
      setAiResult(res.data.result);
    } catch {
      toast.error('AI assist failed. Check your API key or try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const applyImprovedContent = () => {
    setForm(f => ({ ...f, content: `<p>${aiResult.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>` }));
    setAiResult('');
    setAiPanel(null);
    toast.success('Content updated!');
  };

  // AI: Generate summary
  const handleSummary = async () => {
    if (!form.content) { toast.error('Write some content first'); return; }
    setAiLoading(true);
    try {
      const tmp = document.createElement('div');
      tmp.innerHTML = form.content;
      const res = await aiAPI.summary(tmp.textContent, form.title);
      setForm(f => ({ ...f, summary: res.data.summary }));
      toast.success('Summary generated!');
    } catch {
      toast.error('AI summary failed');
    } finally {
      setAiLoading(false);
    }
  };

  // AI: Suggest titles
  const handleSuggestTitles = async () => {
    if (!form.content) { toast.error('Write some content first'); return; }
    setAiLoading(true);
    setSuggestedTitles([]);
    try {
      const tmp = document.createElement('div');
      tmp.innerHTML = form.content;
      const res = await aiAPI.suggestTitle(tmp.textContent, form.title);
      setSuggestedTitles(res.data.titles || []);
    } catch {
      toast.error('AI title suggestion failed');
    } finally {
      setAiLoading(false);
    }
  };

  // AI: Suggest tags
  const handleSuggestTags = async () => {
    if (!form.content) { toast.error('Write some content first'); return; }
    setAiLoading(true);
    setSuggestedTags([]);
    try {
      const tmp = document.createElement('div');
      tmp.innerHTML = form.content;
      const res = await aiAPI.suggestTags(tmp.textContent, form.title);
      setSuggestedTags(res.data.tags || []);
    } catch {
      toast.error('AI tag suggestion failed');
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  return (
    <div className="page-main">
      <div className="container">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 900,
              color: 'var(--ink)',
              marginBottom: 6,
            }}>
              {isEdit ? '✏️ Edit Article' : '✨ New Article'}
            </h1>
            <p style={{ color: 'var(--ink-muted)' }}>
              {isEdit ? 'Update your article below' : 'Share your knowledge with the community'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="form-input"
                style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 700, padding: '14px 16px' }}
                placeholder="Write a compelling title..."
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
            </div>

            {/* Category & Tags row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 20 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category *</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">
                  Tags
                  <button
                    type="button"
                    onClick={() => { setAiPanel('tags'); handleSuggestTags(); }}
                    className="btn btn-sm"
                    style={{ marginLeft: 8, padding: '2px 8px', fontSize: 11, background: '#f3f0ff', color: '#5b21b6', border: '1px solid #c4b5fd' }}
                  >
                    ✨ AI Suggest
                  </button>
                </label>
                <input
                  className="form-input"
                  placeholder="react, javascript, web-development"
                  value={form.tags}
                  onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                />
                {suggestedTags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                    <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>Suggestions:</span>
                    {suggestedTags.map(tag => (
                      <button
                        key={tag} type="button"
                        className="badge badge-tag"
                        style={{ cursor: 'pointer', fontSize: 12 }}
                        onClick={() => {
                          const existing = form.tags.split(',').map(t => t.trim()).filter(Boolean);
                          if (!existing.includes(tag)) {
                            setForm(f => ({ ...f, tags: [...existing, tag].join(', ') }));
                          }
                        }}
                      >+ #{tag}</button>
                    ))}
                    <button
                      type="button" className="btn btn-sm"
                      style={{ fontSize: 11, padding: '2px 8px' }}
                      onClick={() => setForm(f => ({ ...f, tags: suggestedTags.join(', ') }))}
                    >Use all</button>
                  </div>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="form-group">
              <label className="form-label">
                Summary
                <button
                  type="button"
                  onClick={() => { setAiPanel('summary'); handleSummary(); }}
                  className="btn btn-sm"
                  style={{ marginLeft: 8, padding: '2px 8px', fontSize: 11, background: '#f3f0ff', color: '#5b21b6', border: '1px solid #c4b5fd' }}
                >
                  ✨ AI Generate
                </button>
              </label>
              <textarea
                className="form-textarea"
                placeholder="A brief summary shown on article cards. Leave blank or use AI to generate."
                value={form.summary}
                onChange={e => setForm(f => ({ ...f, summary: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Content Editor */}
            <div className="form-group">
              <label className="form-label">Content *</label>
              <RichEditor
                content={form.content}
                onChange={(html) => setForm(f => ({ ...f, content: html }))}
              />
            </div>

            {/* AI Writing Assistant Panel */}
            <div style={{
              background: 'linear-gradient(135deg, #1e1b4b, #1e3a8a)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 24px',
              marginBottom: 24,
              color: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 18 }}>🤖</span>
                <span style={{ fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  AI Writing Assistant
                </span>
                <span style={{
                  fontSize: 11, background: 'rgba(255,255,255,0.15)', padding: '2px 8px',
                  borderRadius: 100, marginLeft: 4,
                }}>Powered by Gemini</span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => { setAiPanel('improve'); handleImprove('clarity'); }}
                  className="btn btn-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', backdropFilter: 'blur(4px)' }}
                  disabled={aiLoading}
                >
                  ✨ Improve Clarity
                </button>
                <button
                  type="button"
                  onClick={() => { setAiPanel('improve'); handleImprove('grammar'); }}
                  className="btn btn-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
                  disabled={aiLoading}
                >
                  📝 Fix Grammar
                </button>
                <button
                  type="button"
                  onClick={() => { setAiPanel('improve'); handleImprove('concise'); }}
                  className="btn btn-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
                  disabled={aiLoading}
                >
                  ✂️ Make Concise
                </button>
                <button
                  type="button"
                  onClick={() => { setAiPanel('titles'); handleSuggestTitles(); }}
                  className="btn btn-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)' }}
                  disabled={aiLoading}
                >
                  💡 Suggest Titles
                </button>
              </div>

              {aiLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14 }}>
                  <div className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white', width: 18, height: 18 }} />
                  <span style={{ fontSize: 13, opacity: 0.8 }}>AI is thinking...</span>
                </div>
              )}

              {/* Improved content result */}
              {aiPanel === 'improve' && aiResult && (
                <div style={{
                  marginTop: 16,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  padding: 16,
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    AI Suggestion:
                  </p>
                  <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap', opacity: 0.95 }}>
                    {aiResult.slice(0, 600)}{aiResult.length > 600 ? '...' : ''}
                  </p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button
                      type="button"
                      onClick={applyImprovedContent}
                      className="btn btn-sm"
                      style={{ background: 'white', color: '#1e1b4b', fontWeight: 700 }}
                    >✓ Apply</button>
                    <button
                      type="button"
                      onClick={() => { setAiResult(''); setAiPanel(null); }}
                      className="btn btn-sm"
                      style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                    >✕ Dismiss</button>
                  </div>
                </div>
              )}

              {/* Title suggestions */}
              {aiPanel === 'titles' && suggestedTitles.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Suggested Titles:
                  </p>
                  {suggestedTitles.map((t, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 6,
                        padding: '10px 14px',
                        marginBottom: 8,
                        cursor: 'pointer',
                        fontSize: 14,
                        transition: 'background 0.15s',
                      }}
                      onClick={() => {
                        setForm(f => ({ ...f, title: t }));
                        setSuggestedTitles([]);
                        setAiPanel(null);
                        toast.success('Title applied!');
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                      {t}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate(isEdit ? `/articles/${id}` : '/')}
              >Cancel</button>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={saving}
              >
                {saving
                  ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Saving...</>
                  : isEdit ? '💾 Save Changes' : '🚀 Publish Article'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleFormPage;
