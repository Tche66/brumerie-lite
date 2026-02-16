// src/App.tsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthPage } from '@/pages/AuthPage';
import { HomePage } from '@/pages/HomePage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { SellPage } from '@/pages/SellPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { SellerProfilePage } from '@/pages/SellerProfilePage';
import { BottomNav } from '@/components/BottomNav';
import { Product } from '@/types';

function AppContent() {
  const { currentUser } = useAuth();
  const [activePage, setActivePage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);

  // Pas connecté → AuthPage
  if (!currentUser) {
    return <AuthPage />;
  }

  // Navigation handlers
  const handleNavigate = (page: string) => {
    setActivePage(page);
    setSelectedProduct(null);
    setSelectedSellerId(null);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActivePage('product-detail');
  };

  const handleSellerClick = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    setActivePage('seller-profile');
  };

  const handleBackToHome = () => {
    setActivePage('home');
    setSelectedProduct(null);
    setSelectedSellerId(null);
  };

  const handlePublishSuccess = () => {
    setActivePage('home');
    // Optionnel: afficher une notification de succès
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Pages */}
      {activePage === 'home' && (
        <HomePage
          onProductClick={handleProductClick}
          onProfileClick={() => handleNavigate('profile')}
        />
      )}

      {activePage === 'product-detail' && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onBack={handleBackToHome}
          onSellerClick={handleSellerClick}
        />
      )}

      {activePage === 'sell' && (
        <SellPage
          onClose={handleBackToHome}
          onSuccess={handlePublishSuccess}
        />
      )}

      {activePage === 'profile' && (
        <ProfilePage onProductClick={handleProductClick} />
      )}

      {activePage === 'seller-profile' && selectedSellerId && (
        <SellerProfilePage
          sellerId={selectedSellerId}
          onBack={() => setActivePage('product-detail')}
          onProductClick={handleProductClick}
        />
      )}

      {/* Bottom Navigation - visible seulement sur pages principales */}
      {['home', 'profile'].includes(activePage) && (
        <BottomNav activePage={activePage} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
