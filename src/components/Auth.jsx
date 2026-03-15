import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const ERRORS = {
  'auth/email-already-in-use': 'Email already registered.',
  'auth/wrong-password': 'Invalid email or password.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/invalid-email': 'Invalid email address.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-credential': 'Invalid email or password.',
};

export default function Auth() {
  const { register, login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!username.trim()) { setError('Username is required.'); setLoading(false); return; }
        await register(email, password, username.trim());
      }
    } catch (err) {
      setError(ERRORS[err.code] || 'Something went wrong. Try again.');
    }
    setLoading(false);
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1 className="app-title" style={{ marginBottom: 4 }}>Health Fact Check</h1>
        <p className="auth-subtitle">Swipe left for fake · Swipe right for real</p>

        <h2 className="auth-heading">{isLogin ? 'Sign In' : 'Create Account'}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          {!isLogin && (
            <input
              className="auth-input"
              type="text"
              placeholder="Username (shown on leaderboard)"
              value={username}
              onChange={e => setUsername(e.target.value)}
              maxLength={20}
              required
            />
          )}
          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
          {error && <p className="auth-error">{error}</p>}
          <button className="restart-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button className="auth-toggle" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
