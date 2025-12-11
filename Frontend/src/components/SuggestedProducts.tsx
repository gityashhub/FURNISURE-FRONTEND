import { useState, useEffect } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SuggestedProductsProps {
  currentProductId: string;
  category: string;
  roomType: string;
}

const SuggestedProducts = ({ currentProductId, category, roomType }: SuggestedProductsProps) => {
  const { products, loading } = useProducts();

  // Filter products: exclude current, prioritize category, then roomType, then random
  let suggested: Product[] = products.filter(p => p.id !== currentProductId);
  let categoryProducts = suggested.filter(p => p.category === category);
  let roomTypeProducts = suggested.filter(p => p.room_type === roomType && !categoryProducts.some(cp => cp.id === p.id));
  let others = suggested.filter(p => !categoryProducts.some(cp => cp.id === p.id) && !roomTypeProducts.some(rp => rp.id === p.id));

  let finalSuggested: Product[] = [];
  if (categoryProducts.length >= 4) {
    finalSuggested = categoryProducts.slice(0, 4);
  } else if (categoryProducts.length + roomTypeProducts.length >= 4) {
    finalSuggested = [...categoryProducts, ...roomTypeProducts].slice(0, 4);
  } else {
    finalSuggested = [...categoryProducts, ...roomTypeProducts, ...others].slice(0, 4);
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">You might also like</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (finalSuggested.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">You might also like</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {finalSuggested.map((product) => {
          const displayImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
          return (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="aspect-square rounded-lg overflow-hidden mb-3">
                    <img
                      src={displayImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <Badge variant="secondary" className="mb-2 text-xs">
                    {product.brand}
                  </Badge>
                  <h4 className="font-medium text-sm mb-1 line-clamp-2">{product.name}</h4>
                  <div className="flex items-center mb-2">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-xs text-muted-foreground">{product.product_rating}</span>
                  </div>
                  <p className="font-semibold text-[#bb9a65]">₹{product.price.toLocaleString()}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SuggestedProducts;
