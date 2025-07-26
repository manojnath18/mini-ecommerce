'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Star, Loader2, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { useCart } from '@/context/cart-context';

interface Rating {
  rate: number;
  count: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}

export default function ProductDisplay() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://fakestoreapi.com/products');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewProduct = (productId: number): void => {
    router.push(`/product/${productId}`);
  };

  const handleAddToCart = (product: Product): void => {
    addToCart({ ...product, quantity: 1 });
  };

  const renderStars = (rating: number): React.ReactElement[] => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-amber-400/50 text-amber-400" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "men's clothing": "bg-blue-100 text-blue-800 border-blue-200",
      "women's clothing": "bg-pink-100 text-pink-800 border-pink-200",
      "jewelery": "bg-purple-100 text-purple-800 border-purple-200",
      "electronics": "bg-green-100 text-green-800 border-green-200",
    };
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl bg-white shadow-lg">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          <span className="text-lg font-semibold text-gray-700">Loading amazing products...</span>
          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center space-y-6 p-8 rounded-2xl bg-white shadow-lg max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
          <Button 
            onClick={fetchProducts} 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 mb-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-2 text-white">
            Discover Amazing Products
          </h1>
          <p className="text-xl text-blue-100 mx-auto leading-relaxed text-center">
            Explore our curated collection of premium products at unbeatable prices
          </p>
          <div className="mt-8 flex justify-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-2 border border-white/20">
              <span className="text-sm font-medium">{products.length} Products Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white rounded-md cursor-pointer"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              onClick={() => handleViewProduct(product.id)}
            >
              {/* Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 p-4 cursor-pointer overflow-hidden">
                <div className="absolute top-4 right-4 z-10">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg border-0 p-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
                  </Button>
                </div>
                
                <div 
                  className="w-full h-full relative flex items-center justify-center"
                >
                  <Image
                    src={product.image}
                    width={150}
                    height={150}
                    alt={product.title}
                    className="w-32 h-32 object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Overlay on hover */}
                <div className={`absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300 ${
                  hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={() => handleViewProduct(product.id)}
                      className="bg-white text-gray-800 hover:bg-gray-100 shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300 rounded-full px-6"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Quick View
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                {/* Category Badge */}
                <div className="flex items-center justify-between">
                  <Badge 
                    className={`capitalize font-medium px-3 py-1 rounded-full text-xs border ${getCategoryColor(product.category)}`}
                  >
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating.rate)}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.rating.count})
                    </span>
                  </div>
                </div>
                
                {/* Product Title */}
                <h3 
                  className="font-bold text-lg leading-tight text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]"
                >
                  {product.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
                  {truncateText(product.description, 80)}
                </p>
                
                {/* Price and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-500">Best price</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                      size="sm"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}