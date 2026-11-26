import { useState, useRef, useEffect } from 'react';
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
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // L'URL affichée suit la valeur du formulaire (chargée de façon asynchrone).
  const previewUrl = localPreview ?? currentImageUrl ?? '';

  useEffect(() => {
    setBroken(false);
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`La taille du fichier ne doit pas dépasser ${maxSizeMB} Mo`);
      return;
    }

    setError(null);
    setUploading(true);
    setLocalPreview(URL.createObjectURL(file));

    try {
      const result = await uploadImage(file);
      onImageUploaded(result.url);
    } catch (err) {
      console.error('Erreur upload:', err);
      setError("Erreur lors du téléchargement de l'image");
    } finally {
      setLocalPreview(null);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = () => {
    setLocalPreview(null);
    setError(null);
    onImageUploaded('');
  };

  return (
    <div>
      <span className="block text-gray-700 font-medium mb-2">{label}</span>

      <div className="space-y-3">
        {previewUrl ? (
          <div className="relative inline-block">
            {broken ? (
              <div className="h-40 w-64 max-w-full rounded-lg border-2 border-gray-300 bg-gray-50 flex items-center justify-center text-sm text-gray-500 p-4 text-center">
                Impossible de charger l'image
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="Aperçu"
                className="h-40 w-auto max-w-full rounded-lg border-2 border-gray-300 object-contain bg-gray-50"
                onError={() => setBroken(true)}
              />
            )}
            {!uploading && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                aria-label="Retirer l'image"
              >
                <X size={16} />
              </button>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#27ae60] transition-colors"
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Cliquez pour télécharger une image</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, WEBP jusqu'à {maxSizeMB} Mo</p>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          aria-label={label}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#27ae60] file:text-white hover:file:bg-[#229954] file:cursor-pointer disabled:opacity-50"
        />

        {uploading && (
          <div className="flex items-center gap-2 text-[#27ae60]">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#27ae60] border-t-transparent"></div>
            <span className="text-sm">Téléchargement en cours...</span>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>
        )}
      </div>
    </div>
  );
}
