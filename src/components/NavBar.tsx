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

      <div>
      <span className={cls('home')} onClick={() => setView('home')}>
        Home
      </span>
      <span className={cls('list')} onClick={() => setView('list')}>
        Players
      </span>

      {user ? (
        <>
          <span className='email'>{user.email}</span>
          <span onClick={handleSignOut}>Sign Out</span>
        </>
      ) : (
        <>
          <span className={cls('signin')} onClick={() => setView('signin')}>
            Sign In
          </span>
          <span
            className={`primary ${cls('signup')}`}
            onClick={() => setView('signup')}
          >
            Sign Up
          </span>
        </>
      )}
      </div>
    </nav>
  );
}
