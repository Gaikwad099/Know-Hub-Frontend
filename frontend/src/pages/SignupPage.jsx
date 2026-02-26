import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.signup({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(res.data.token, res.data.user);
      toast.success('Account created! Welcome to KnowHub 🎉');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors?.[0]?.msg || 'Signup failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--paper)',
      padding: '20px',
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{
              width: 52, height: 52, background: 'var(--accent)', borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontFamily: 'var(--font-display)', fontWeight: 900,
              fontSize: 28, margin: '0 auto 12px',
            }}>K</div>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--ink)', marginBottom: 6 }}>
            Join KnowHub
          </h1>
          <p style={{ color: 'var(--ink-muted)', fontSize: 15 }}>Create your free account</p>
        </div>

        <div style={{
          background: 'white', borderRadius: 12, border: '1px solid var(--border)',
          padding: '32px', boxShadow: 'var(--shadow-md)',
        }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                name="username" className="form-input" placeholder="yourhandle"
                value={form.username} onChange={handleChange} required minLength={3}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                name="email" type="email" className="form-input" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                name="password" type="password" className="form-input" placeholder="Min. 6 characters"
                value={form.password} onChange={handleChange} required minLength={6}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                name="confirm" type="password" className="form-input" placeholder="Repeat your password"
                value={form.confirm} onChange={handleChange} required
              />
            </div>

            <button
              type="submit" className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
              disabled={loading}
            >
              {loading ? <><div className="spinner" style={{ width: 18, height: 18 }} /> Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--ink-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ fontWeight: 600, color: 'var(--accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
