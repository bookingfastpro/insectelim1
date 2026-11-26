import { lazy, Suspense, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import ServicesSection from './components/ServicesSection';
import BlogSection from './components/BlogSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import BlogDetail from './components/BlogDetail';
import ServiceDetail from './components/ServiceDetail';
import { usePathname, scrollToHash } from './lib/router';

// L'espace d'administration est chargé à la demande : il n'alourdit pas le site public.
const AdminApp = lazy(() => import('./components/AdminApp'));

function FullScreenLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#27ae60] via-[#229954] to-[#1e8449] flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" role="status" aria-label="Chargement" />
    </div>
  );
}

function App() {
  const pathname = usePathname();

  // Au premier chargement, faire défiler vers l'ancre éventuelle (ex: /#contact)
  useEffect(() => {
    if (window.location.hash) scrollToHash(window.location.hash, true);
  }, []);

  const normalized = pathname.replace(/\/+$/, '') || '/';

  if (normalized === '/admin') {
    return (
      <Suspense fallback={<FullScreenLoader />}>
        <AdminApp />
      </Suspense>
    );
  }

  const serviceMatch = /^\/services\/([^/]+)$/.exec(normalized);
  const blogMatch = /^\/blog\/([^/]+)$/.exec(normalized);

  let content;
  if (serviceMatch) {
    content = <ServiceDetail slug={decodeURIComponent(serviceMatch[1])} />;
  } else if (blogMatch) {
    content = <BlogDetail slug={decodeURIComponent(blogMatch[1])} />;
  } else {
    content = (
      <>
        <HeroSection />
        <ServicesSection />
        <BlogSection />
        <ContactSection />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar solid={normalized !== '/'} />
      <main className="flex-1">{content}</main>
      <Footer />
    </div>
  );
}

export default App;
