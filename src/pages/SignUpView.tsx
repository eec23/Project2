import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { View } from '../types';

interface Props {
  setView: (v: View) => void;
}

export default function SignUpView({ setView }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }


    if (data.session) {
      setView('list');
    } else {
      setMessage('Account created. Check your email to confirm, then sign in.');
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      {error && <p className="error">{error}</p>}
      {message && <p style={{ color: 'var(--accent)' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <button className="primary" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p style={{ marginTop: 16 }}>
        Already have an account?{' '}
        <button
          onClick={() => setView('signin')}
          style={{ padding: 0, border: 'none', color: 'var(--accent)', background: 'none', cursor: 'pointer' }}
        >
          Sign In
        </button>
      </p>
    </div>
  );
}
