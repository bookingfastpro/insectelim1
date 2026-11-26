import { supabase } from './supabase';

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadImage = async (file: File): Promise<UploadResult> => {
  const fileExt = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const filePath = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file, {
    // Les noms de fichiers sont uniques : on peut mettre en cache longtemps.
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from('images').getPublicUrl(filePath);
  return { url: data.publicUrl, path: filePath };
};

export const deleteImage = async (path: string): Promise<void> => {
  const { error } = await supabase.storage.from('images').remove([path]);
  if (error) throw error;
};

export const getImageUrl = (path: string): string => {
  const { data } = supabase.storage.from('images').getPublicUrl(path);
  return data.publicUrl;
};
