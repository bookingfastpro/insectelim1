import { useEffect } from 'react';

const DEFAULT_TITLE = 'INSECTELIM – Lutte anti-nuisibles à Porto-Vecchio et en Corse-du-Sud';

/** Met à jour le <title> et la meta description de la page courante. */
export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = meta?.content;
    document.title = title ? `${title} | INSECTELIM` : DEFAULT_TITLE;
    if (meta && description) meta.content = description.slice(0, 160);
    return () => {
      document.title = DEFAULT_TITLE;
      if (meta && previousDescription) meta.content = previousDescription;
    };
  }, [title, description]);
}

export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
