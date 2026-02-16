// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/services/productService';
import { Product, CATEGORIES, NEIGHBORHOODS } from '@/types';

interface HomePageProps {
  onProductClick: (product: Product) => void;
  onProfileClick: () => void;
}

export function HomePage({ onProductClick, onProfileClick }: HomePageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, selectedNeighborhood, searchTerm]);

  async function loadProducts() {
    setLoading(true);
    const filters = {
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      neighborhood: selectedNeighborhood !== 'all' ? selectedNeighborhood : undefined,
      searchTerm: searchTerm || undefined,
    };
    const data = await getProducts(filters);
    setProducts(data);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header onProfileClick={onProfileClick} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Recherche */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          />
        </div>

        {/* Filtres */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {/* Catégories */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
          >
            <option value="all">Toutes catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>

          {/* Quartiers */}
          <select
            value={selectedNeighborhood}
            onChange={(e) => setSelectedNeighborhood(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none bg-white"
          >
            <option value="all">Tous quartiers</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                📍 {n}
              </option>
            ))}
          </select>
        </div>

        {/* Compteur résultats */}
        <p className="text-sm text-gray-600 mb-4">
          {loading ? 'Chargement...' : `${products.length} produit${products.length > 1 ? 's' : ''}`}
        </p>

        {/* Grille produits */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-6xl">📦</span>
            <p className="text-gray-600 mt-4">Aucun produit trouvé</p>
            <p className="text-sm text-gray-500 mt-2">
              Essayez de modifier vos filtres
            </p>
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
