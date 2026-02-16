// src/pages/ProductDetailPage.tsx
import React, { useState } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/Button';
import { generateWhatsAppLink, formatPrice, formatRelativeDate } from '@/utils/helpers';
import { incrementWhatsAppClick } from '@/services/productService';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onSellerClick: (sellerId: string) => void;
}

export function ProductDetailPage({ product, onBack, onSellerClick }: ProductDetailPageProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const handleWhatsAppClick = () => {
    setShowWhatsAppModal(true);
  };

  const handleConfirmWhatsApp = () => {
    // Track clic
    incrementWhatsAppClick(product.id);
    
    // Ouvrir WhatsApp
    const link = generateWhatsAppLink(product.sellerPhone, product.title, product.price);
    window.open(link, '_blank');
    setShowWhatsAppModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={onBack} className="text-2xl">
            ←
          </button>
          <h1 className="text-lg font-semibold">Détails du produit</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Galerie images */}
        <div className="relative">
          <img
            src={product.images[currentImageIndex]}
            alt={product.title}
            className="w-full aspect-square object-cover"
          />
          
          {/* Indicateurs images */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          {/* Prix */}
          <div className="mb-4">
            <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
            <p className="text-sm text-gray-500 mt-1">
              {formatRelativeDate(product.createdAt)} • 📍 {product.neighborhood}
            </p>
          </div>

          {/* Titre et description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{product.title}</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>

          {/* Catégorie */}
          <div className="mb-6 inline-block bg-gray-100 px-3 py-1 rounded-full text-sm">
            {product.category}
          </div>

          {/* Vendeur */}
          <div
            onClick={() => onSellerClick(product.sellerId)}
            className="border border-gray-200 rounded-lg p-4 mb-6 cursor-pointer hover:bg-gray-50 transition"
          >
            <p className="text-sm text-gray-600 mb-2">Vendu par</p>
            <div className="flex items-center gap-3">
              <img
                src={product.sellerPhoto || 'https://via.placeholder.com/48'}
                alt={product.sellerName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{product.sellerName}</p>
                  {product.sellerVerified && (
                    <span className="bg-green-100 text-green-600 text-xs px-2 py-0.5 rounded-full">
                      ✓ Vérifié
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Voir le profil →</p>
              </div>
            </div>
          </div>

          {/* Bouton WhatsApp */}
          <Button
            onClick={handleWhatsAppClick}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            💬 Contacter sur WhatsApp
          </Button>
        </div>
      </div>

      {/* Modal WhatsApp */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Contacter le vendeur</h3>
            <p className="text-gray-600 mb-6">
              Vous allez être redirigé vers WhatsApp avec un message pré-rempli pour{' '}
              <strong>{product.sellerName}</strong>.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                <strong>⚠️ Important :</strong> Brumerie facilite la mise en relation mais ne gère pas
                les transactions. Soyez vigilant et privilégiez les vendeurs vérifiés.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowWhatsAppModal(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button onClick={handleConfirmWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
                Continuer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
