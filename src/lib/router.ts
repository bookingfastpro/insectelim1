import { useEffect, useState } from 'react';

const NAV_EVENT = 'app:navigate';

/**
 * Navigue vers une URL interne sans recharger la page.
 * Gère aussi les ancres (`/#contact`) en faisant défiler vers la section.
 */
export function navigate(to: string) {
  const url = new URL(to, window.location.origin);
  const samePath = url.pathname === window.location.pathname;

  if (url.href !== window.location.href) {
    window.history.pushState({}, '', url.pathname + url.search + url.hash);
  }

  if (!samePath) {
    window.dispatchEvent(new Event(NAV_EVENT));
  }

  scrollToHash(url.hash, !samePath);
}

export function scrollToHash(hash: string, waitForRender = false) {
  if (!hash) {
    window.scrollTo({ top: 0 });
    return;
  }
  const id = decodeURIComponent(hash.slice(1));
  const attempt = (tries: number) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (tries > 0) {
      window.setTimeout(() => attempt(tries - 1), 50);
    }
  };
  if (waitForRender) {
    window.requestAnimationFrame(() => attempt(20));
  } else {
    attempt(0);
  }
}

export function usePathname() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', update);
    window.addEventListener(NAV_EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(NAV_EVENT, update);
    };
  }, []);

  return pathname;
}

/** Gestionnaire de clic pour les liens internes (<a href="/...">). */
export function handleLinkClick(e: React.MouseEvent<HTMLAnchorElement>) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
    return;
  }
  const href = e.currentTarget.getAttribute('href');
  if (!href || !href.startsWith('/')) return;
  e.preventDefault();
  navigate(href);
}
