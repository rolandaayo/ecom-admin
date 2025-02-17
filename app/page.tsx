import Link from 'next/link';
import { ShoppingBag, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-900" />
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Our Store</h1>
          <p className="text-gray-600">
            Browse our collection or manage your store through the admin dashboard.
          </p>
        </div>
        <div className="space-y-4">
          <Link href="/store">
            <Button className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Store
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}