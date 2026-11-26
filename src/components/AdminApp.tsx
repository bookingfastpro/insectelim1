import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

export default function AdminApp() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    document.title = 'Administration | INSECTELIM';
    supabase.auth.getSession().then(({ data }) => {
      setIsAdmin(!!data.session?.user);
      setIsCheckingAuth(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdmin(!!session?.user);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#27ae60] via-[#229954] to-[#1e8449] flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" role="status" aria-label="Chargement" />
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />;
  }

  return <AdminPanel onLogout={() => setIsAdmin(false)} />;
}
