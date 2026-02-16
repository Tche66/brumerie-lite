// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { ProductCard } from '@/components/ProductCard';
import { getSellerProducts } from '@/services/productService';
import { Product } from '@/types';

interface ProfilePageProps {
  onProductClick: (product: Product) => void;
}

export function ProfilePage({ onProductClick }: ProfilePageProps) {
  const { userProfile, signOut } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userProfile) {
      loadUserProducts();
    }
  }, [userProfile]);

  async function loadUserProducts() {
    if (!userProfile) return;
    setLoading(true);
    const data = await getSellerProducts(userProfile.id);
    setProducts(data);
    setLoading(false);
  }

  if (!userProfile) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <img
              src={userProfile.photoURL || 'https://via.placeholder.com/80'}
              alt={userProfile.name}
              className="w-20 h-20 rounded-full object-cover border-4 border-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                {userProfile.isVerified && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    ✓ Vérifié
                  </span>
                )}
              </div>
              <p className="text-white/90">📍 {userProfile.neighborhood}</p>
              <p className="text-white/90 text-sm">
                {userProfile.salesCount} vente{userProfile.salesCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Produits publiés</p>
            <p className="text-2xl font-bold text-primary">{products.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Publications ce mois</p>
            <p className="text-2xl font-bold text-primary">
              {userProfile.publicationCount}/{userProfile.publicationLimit}
            </p>
          </div>
        </div>

        {/* Mes produits */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Mes produits</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <span className="text-6xl">📦</span>
              <p className="text-gray-600 mt-4">Vous n'avez pas encore publié de produits</p>
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

        {/* Bouton déconnexion */}
        <Button
          onClick={signOut}
          variant="outline"
          className="w-full"
        >
          🚪 Se déconnecter
        </Button>
      </div>
    </div>
  );
}
