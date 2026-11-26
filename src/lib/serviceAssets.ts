import { Bug, Bird, ShieldCheck, Home, Rat, LucideIcon } from 'lucide-react';

export const serviceIcons: Record<string, LucideIcon> = {
  bug: Bug,
  bird: Bird,
  'shield-check': ShieldCheck,
  home: Home,
  rat: Rat,
};

const pexels = (id: string, file: string, w: number) =>
  `https://images.pexels.com/photos/${id}/${file}?auto=compress&cs=tinysrgb&w=${w}`;

const imageSources: Record<string, [string, string]> = {
  bug: ['3714898', 'pexels-photo-3714898.jpeg'],
  bird: ['349758', 'hummingbird-bird-birds-349758.jpeg'],
  'shield-check': ['4207892', 'pexels-photo-4207892.jpeg'],
  home: ['106399', 'pexels-photo-106399.jpeg'],
  rat: ['2324028', 'pexels-photo-2324028.jpeg'],
};

export function getServiceIcon(icon: string): LucideIcon {
  return serviceIcons[icon] ?? Bug;
}

export function getServiceImage(icon: string, imageUrl: string | undefined, width = 600) {
  if (imageUrl) return imageUrl;
  const [id, file] = imageSources[icon] ?? imageSources.bug;
  return pexels(id, file, width);
}
