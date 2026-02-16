// src/pages/SellPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { createProduct, canUserPublish } from '@/services/productService';
import { compressImage } from '@/utils/helpers';
import { CATEGORIES, NEIGHBORHOODS } from '@/types';

interface SellPageProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SellPage({ onClose, onSuccess }: SellPageProps) {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [canPublish, setCanPublish] = useState(true);
  const [publicationCount, setPublicationCount] = useState(0);
  const [publicationLimit, setPublicationLimit] = useState(50);

  // Form state
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [neighborhood, setNeighborhood] = useState(userProfile?.neighborhood || '');

  useEffect(() => {
    checkPublicationLimit();
  }, []);

  async function checkPublicationLimit() {
    if (!userProfile) return;
    const check = await canUserPublish(userProfile.id);
    setCanPublish(check.canPublish);
    setPublicationCount(check.count);
    setPublicationLimit(check.limit);
    if (!check.canPublish) {
      setError(check.reason || 'Limite atteinte');
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 3) {
      setError('Maximum 3 images');
      return;
    }

    setError('');
    const newImages: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      const compressed = await compressImage(file);
      newImages.push(compressed);
      newPreviews.push(URL.createObjectURL(compressed));
    }

    setImages([...images, ...newImages]);
    setImagePreviews([...imagePreviews, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userProfile) return;
    if (!canPublish) return;
    if (images.length === 0) {
      setError('Veuillez ajouter au moins une photo');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createProduct(
        {
          title,
          price: parseFloat(price),
          description,
          category,
          neighborhood,
          sellerId: userProfile.id,
          sellerName: userProfile.name,
          sellerPhone: userProfile.phone,
          sellerPhoto: userProfile.photoURL,
          sellerVerified: userProfile.isVerified,
          images: [],
        },
        images
      );

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la publication');
      setLoading(false);
    }
  };

  if (!canPublish) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 max-w-md w-full">
          <h3 className="text-xl font-bold mb-4">❌ Limite atteinte</h3>
          <p className="text-gray-700 mb-6">
            Vous avez publié <strong>{publicationCount}/{publicationLimit}</strong> produits ce mois-ci.
          </p>
          <Button onClick={onClose} className="w-full">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={onClose} className="text-2xl">
            ←
          </button>
          <h1 className="text-lg font-semibold">Publier un produit</h1>
          <div className="w-6"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Compteur publications */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-sm text-blue-800">
            📊 <strong>{publicationCount}/{publicationLimit}</strong> produits publiés ce mois
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (1 à 3)
            </label>
            
            {/* Previews */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}

              {/* Add button */}
              {images.length < 3 && (
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="text-3xl text-gray-400">+</span>
                </label>
              )}
            </div>
          </div>

          <Input
            label="Titre"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: iPhone 13 Pro Max 256GB"
            maxLength={60}
            required
          />

          <Input
            label="Prix (FCFA)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="50000"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            >
              <option value="">Sélectionner</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre produit..."
              maxLength={500}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {description.length}/500 caractères
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quartier
            </label>
            <select
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              required
            >
              <option value="">Sélectionner</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Publication...' : '✅ Publier le produit'}
          </Button>
        </form>
      </div>
    </div>
  );
}
