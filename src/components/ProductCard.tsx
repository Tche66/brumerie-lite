// src/components/ProductCard.tsx
import React from 'react';
import { Product } from '@/types';
import { formatPrice, formatRelativeDate } from '@/utils/helpers';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        {/* Badge NOUVEAU si <48h */}
        {new Date().getTime() - product.createdAt.getTime() < 48 * 60 * 60 * 1000 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            NOUVEAU
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-3">
        {/* Prix */}
        <p className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</p>

        {/* Titre */}
        <h3 className="text-sm text-gray-800 mt-1 line-clamp-2">{product.title}</h3>

        {/* Infos vendeur */}
        <div className="flex items-center gap-2 mt-2">
          <img
            src={product.sellerPhoto || 'https://via.placeholder.com/32'}
            alt={product.sellerName}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-xs text-gray-600">{product.sellerName}</span>
          {product.sellerVerified && (
            <span className="text-green-500 text-xs">✓</span>
          )}
        </div>

        {/* Quartier + Date */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>📍 {product.neighborhood}</span>
          <span>{formatRelativeDate(product.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
