import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import BlogDetail from './components/BlogDetail';
import ServiceDetail from './components/ServiceDetail';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [currentBlogSlug, setCurrentBlogSlug] = useState<string | null>(null);
  const [currentServiceSlug, setCurrentServiceSlug] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        (() => {
          setIsAdmin(!!session?.user);
        })();
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    setIsAdmin(!!data.session?.user);
    setIsCheckingAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#27ae60] via-[#229954] to-[#1e8449] flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Chargement...</div>
      </div>
    );
  }

  if (window.location.pathname === '/admin') {
    if (isAdmin) {
      return <AdminPanel onLogout={handleLogout} />;
    } else {
      return <AdminLogin onLoginSuccess={() => setIsAdmin(true)} />;
    }
  }

  if (currentServiceSlug) {
    return (
      <div className="min-h-screen">
        <ServiceDetail slug={currentServiceSlug} onBack={() => setCurrentServiceSlug(null)} />
        <Footer />
      </div>
    );
  }

  if (currentBlogSlug) {
    return (
      <div className="min-h-screen">
        <BlogDetail slug={currentBlogSlug} onBack={() => setCurrentBlogSlug(null)} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServicesSection onServiceClick={(slug) => setCurrentServiceSlug(slug)} />
      <BlogSection onReadMore={(slug) => setCurrentBlogSlug(slug)} />
      <ContactSection />
      <Footer />
    </div>
  );
}

export default App;
