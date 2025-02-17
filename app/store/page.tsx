"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  rating: number;
  reviews: number;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching products...');
        
        const response = await axios.get('http://localhost:5001/api/products', {
          timeout: 5000 // 5 second timeout
        });
        
        console.log('Response received:', response.data);
        
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format');
        }
        
        setProducts(response.data);
      } catch (error: any) {
        console.error('Error details:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load products';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">No products found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Our Store</h1>
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="outline">Admin Dashboard</Button>
              </Link>
              <Button>
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">${product.price}</span>
                  <Button>Add to Cart</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}