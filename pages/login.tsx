import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        router.push('/');
      } else {
        setErr(data.message || 'Login failed');
      }
    } catch (error) {
      setErr('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="loginWrapper">
      <div className="loginBackground">
        <div className="circle circle1"></div>
        <div className="circle circle2"></div>
        <div className="circle circle3"></div>
      </div>

      <div className="loginContainer">
        <div className="loginCard">
          <div className="loginHeader">
            <div className="logoIcon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 4L44 14V34L24 44L4 34V14L24 4Z" stroke="url(#grad)" strokeWidth="2" fill="none"/>
                <circle cx="24" cy="24" r="8" fill="url(#grad)" opacity="0.6"/>
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f5ff" />
                    <stop offset="100%" stopColor="#7000ff" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <h1 className="loginTitle">Machine Monitoring Dashboard</h1>
            <p className="loginSubtitle">Enter your credentials to access the system</p>
          </div>

          <form onSubmit={submit} className="loginForm">
            <div className="inputGroup">
              <label htmlFor="email" className="inputLabel">Email Address</label>
              <div className="inputWrapper">
                <svg className="inputIcon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 4h14a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 5l8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="styledInput"
                  required
                />
              </div>
            </div>

            <div className="inputGroup">
              <label htmlFor="password" className="inputLabel">Password</label>
              <div className="inputWrapper">
                <svg className="inputIcon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="9" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 9V6a4 4 0 118 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  className="styledInput"
                  required
                />
              </div>
            </div>

            {err && (
              <div className="errorBox" role="alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 4v5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                {err}
              </div>
            )}

            <button type="submit" className="loginButton" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In
                  <svg className="buttonArrow" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M7 3l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="loginFooter">
            <div className="securityBadge">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1l5 2v4c0 3-2 5-5 6-3-1-5-3-5-6V3l5-2z" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              </svg>
              Secured with JWT Authentication
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
