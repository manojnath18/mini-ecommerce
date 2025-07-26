'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  mainImage: {
    url: string;
  };
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/ecommerce/products');
      const result = await res.json();
      console.log('API response:', result);

      const productList = result?.data?.products;
      if (Array.isArray(productList)) {
        setProducts(productList);
      } else {
        console.error('Unexpected API response format', result);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div className="p-4">Loading products...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => {
          const imageUrl = product.mainImage?.url;


          return (
            <Card key={product._id} className="p-4 flex flex-col items-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mb-2 object-contain"
                />
              ) : (
                <div className="w-[150px] h-[150px] mb-2 bg-gray-100 flex items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}

              <h2 className="text-lg font-semibold text-center">{product.name}</h2>
              <p className="text-sm text-gray-600 mb-1 text-center">{product.description}</p>
              <p className="text-green-700 font-bold">${product.price}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
