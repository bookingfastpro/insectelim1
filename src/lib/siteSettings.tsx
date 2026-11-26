/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  logo_url: string;
}

export interface SiteSettingsValue {
  contact: ContactInfo;
  hero: HeroSettings;
  loaded: boolean;
}

export const DEFAULT_CONTACT: ContactInfo = {
  phone: '04 95 XX XX XX',
  email: 'contact@insectelim.fr',
  address: 'Porto-Vecchio, Corse-du-Sud',
  hours: 'Lundi - Samedi : 8h - 19h',
};

export const DEFAULT_HERO: HeroSettings = {
  title: '',
  subtitle: '',
  logo_url: '',
};

/** Fusionne une valeur JSON venant de la base avec des valeurs par défaut (ignore les champs vides). */
export function withDefaults<T extends object>(defaults: T, value: unknown): T {
  const result = { ...defaults };
  if (value && typeof value === 'object') {
    for (const key of Object.keys(defaults) as (keyof T)[]) {
      const v = (value as Record<string, unknown>)[key as string];
      if (typeof v === 'string' && v.trim() !== '') {
        result[key] = v as T[keyof T];
      }
    }
  }
  return result;
}

const SiteSettingsContext = createContext<SiteSettingsValue>({
  contact: DEFAULT_CONTACT,
  hero: DEFAULT_HERO,
  loaded: false,
});

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettingsValue>({
    contact: DEFAULT_CONTACT,
    hero: DEFAULT_HERO,
    loaded: false,
  });

  useEffect(() => {
    let cancelled = false;
    supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['contact_info', 'hero_section'])
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) console.error('Erreur chargement paramètres:', error);
        const byKey = new Map((data ?? []).map((row) => [row.key, row.value]));
        setSettings({
          contact: withDefaults(DEFAULT_CONTACT, byKey.get('contact_info')),
          hero: withDefaults(DEFAULT_HERO, byKey.get('hero_section')),
          loaded: true,
        });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <SiteSettingsContext.Provider value={settings}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

/** Liens téléphone / WhatsApp normalisés. */
export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function whatsappHref(phone: string) {
  let digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) digits = digits.slice(1);
  else if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = `33${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

