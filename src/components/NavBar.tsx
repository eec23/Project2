import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { View } from '../types';

interface Props {
  view: View;
  setView: (v: View) => void;
  user: User | null;
}

export default function NavBar({ view, setView, user }: Props) {
  async function handleSignOut() {
    await supabase.auth.signOut();
    setView('home');
  }

  const cls = (target: View) => (view === target ? 'active' : '');

  return (
    <nav className="nav">
      <span className="brand">NBA Database</span>

      <button className={cls('home')} onClick={() => setView('home')}>
        Home
      </button>
      <button className={cls('list')} onClick={() => setView('list')}>
        Players
      </button>

      <span className="spacer" />

      {user ? (
        <>
          <span style={{ color: 'var(--muted)' }}>{user.email}</span>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <button className={cls('signin')} onClick={() => setView('signin')}>
            Sign In
          </button>
          <button
            className={`primary ${cls('signup')}`}
            onClick={() => setView('signup')}
          >
            Sign Up
          </button>
        </>
      )}
    </nav>
  );
}
