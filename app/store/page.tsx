"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios-config';
import { ShoppingCart, Search, User, Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';

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

interface CartItem extends Product {
  quantity: number;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/api/products');
        
        if (!Array.isArray(response.data)) {
          throw new Error('Invalid response format');
        }
        
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error: any) {
        console.error('Fetch error:', error);
        const errorMessage = error.message || 'Failed to load products';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const addToCart = (productId: string) => {
    const product = products.find(p => p._id === productId);
    if (product) {
      setCartItems(prev => {
        const existingItem = prev.find(item => item._id === productId);
        if (existingItem) {
          return prev.map(item =>
            item._id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
      toast.success('Product added to cart');
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-700 animate-pulse">Loading products 🛍️🛍️...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-2xl font-semibold text-red-600 bg-red-50 p-6 rounded-lg shadow-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      <nav className="bg-white shadow-md backdrop-blur-sm bg-white/90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">ShopHub</span>
            </Link>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-purple-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/wishlist">
                <Button variant="ghost" className="relative">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/account">
                <Button variant="ghost">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
              <div className="relative">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg transition-all duration-300 relative"
                  onClick={() => setIsCartOpen(!isCartOpen)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>

                {isCartOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Shopping Cart</h3>
                        <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={20} />
                        </button>
                      </div>
                      {cartItems.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Your cart is empty</p>
                      ) : (
                        <>
                          <div className="max-h-60 overflow-y-auto">
                            {cartItems.map((item) => (
                              <div key={item._id} className="flex items-center gap-4 mb-4">
                                <div className="relative w-16 h-16">
                                  <Image
                                    src={item.imageUrl}
                                    alt={item.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium">{item.name}</h4>
                                  <p className="text-sm text-gray-500">
                                    {item.quantity} × ${item.price}
                                  </p>
                                </div>
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between mb-4">
                              <span className="font-semibold">Total:</span>
                              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                            </div>
                            <Link href="/cart">
                              <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
                                Checkout
                              </Button>
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className="relative h-64 overflow-hidden group">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Button
                  variant="ghost"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2"
                  onClick={() => toast.success('Added to wishlist')}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2 text-gray-800">{product.name}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < product.rating ? "text-yellow-400" : "text-gray-300"}>★</span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    ${product.price}
                  </span>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg transition-all duration-300"
                    onClick={() => addToCart(product._id)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-600">Your trusted destination for quality products and exceptional shopping experience.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-purple-600">About</Link></li>
                <li><Link href="/contact" className="text-gray-600 hover:text-purple-600">Contact</Link></li>
                <li><Link href="/faq" className="text-gray-600 hover:text-purple-600">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link href="/shipping" className="text-gray-600 hover:text-purple-600">Shipping Info</Link></li>
                <li><Link href="/returns" className="text-gray-600 hover:text-purple-600">Returns</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-purple-600">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg border focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-gray-600">
            <p>© 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}