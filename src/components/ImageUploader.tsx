import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadImage } from '../lib/imageUpload';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
}

export default function ImageUploader({
  currentImageUrl,
  onImageUploaded,
  label = 'Image',
  maxSizeMB = 5
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`La taille du fichier ne doit pas dépasser ${maxSizeMB}MB`);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      const result = await uploadImage(file);
      onImageUploaded(result.url);
    } catch (err) {
      console.error('Erreur upload:', err);
      setError('Erreur lors du téléchargement de l\'image');
      setPreviewUrl(currentImageUrl);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(undefined);
    onImageUploaded('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">{label}</label>

      <div className="space-y-3">
        {previewUrl ? (
          <div className="relative inline-block">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-40 w-auto max-w-full rounded-lg border-2 border-gray-300 object-contain bg-gray-50"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                setError('Impossible de charger l\'image');
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#27ae60] transition-colors">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Cliquez pour télécharger une image
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF, WEBP jusqu'à {maxSizeMB}MB
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#27ae60] file:text-white hover:file:bg-[#229954] file:cursor-pointer disabled:opacity-50"
        />

        {uploading && (
          <div className="flex items-center gap-2 text-[#27ae60]">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#27ae60] border-t-transparent"></div>
            <span className="text-sm">Téléchargement en cours...</span>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
