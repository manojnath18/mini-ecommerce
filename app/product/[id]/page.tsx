'use client';

import { useState, useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { Star, ShoppingCart, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

export default function ProductPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://fakestoreapi.com/products/${params.id}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          setError(true);
          return;
        }

        const data = await res.json();
        setProduct(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      getProduct();
    }
  }, [params.id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity: 1 });
      // Optional: Show a success message or toast
      console.log('Product added to cart:', product.title);
    }
  };

  const renderStars = (rating: number): React.ReactElement[] => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading product...</span>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center min-h-[500px]">
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={400}
                  height={400}
                  className="object-contain max-w-80 max-h-80 w-auto h-auto rounded-lg shadow-md"
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <Badge 
                  variant="secondary" 
                  className="capitalize font-medium px-4 py-2 text-sm bg-blue-100 text-blue-800 border-blue-200 w-fit"
                >
                  {product.category}
                </Badge>

                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating.rate)}
                  </div>
                  <span className="text-gray-500 text-sm font-medium">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex flex-col">
                    <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">Best price guaranteed</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 text-lg rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  onClick={handleAddToCart}
                  size="lg"
                >
                  <ShoppingCart className="w-6 h-6 mr-3" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}