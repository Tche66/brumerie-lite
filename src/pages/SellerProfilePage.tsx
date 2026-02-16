// src/pages/SellerProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { ProductCard } from '@/components/ProductCard';
import { getUserById } from '@/services/userService';
import { getSellerProducts } from '@/services/productService';
import { Product, User } from '@/types';
import { formatRelativeDate } from '@/utils/helpers';

interface SellerProfilePageProps {
  sellerId: string;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

export function SellerProfilePage({ sellerId, onBack, onProductClick }: SellerProfilePageProps) {
  const [seller, setSeller] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellerData();
  }, [sellerId]);

  async function loadSellerData() {
    setLoading(true);
    const [sellerData, sellerProducts] = await Promise.all([
      getUserById(sellerId),
      getSellerProducts(sellerId),
    ]);
    setSeller(sellerData);
    setProducts(sellerProducts);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-600">Vendeur non trouvé</p>
          <Button onClick={onBack} className="mt-4">
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={onBack} className="text-2xl">
            ←
          </button>
          <h1 className="text-lg font-semibold">Profil vendeur</h1>
        </div>
      </div>

      {/* Profil */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <img
              src={seller.photoURL || 'https://via.placeholder.com/80'}
              alt={seller.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{seller.name}</h2>
                {seller.isVerified && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Vérifié par Brumerie
                  </span>
                )}
              </div>
              <p className="text-white/90">📍 {seller.neighborhood}</p>
              <p className="text-white/90 text-sm">
                {seller.salesCount} vente{seller.salesCount > 1 ? 's' : ''} •{' '}
                Membre depuis {formatRelativeDate(seller.createdAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Produits */}
        <h3 className="text-xl font-bold mb-4">
          Produits de {seller.name} ({products.length})
        </h3>

        {products.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <span className="text-6xl">📦</span>
            <p className="text-gray-600 mt-4">Aucun produit pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onProductClick(product)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
