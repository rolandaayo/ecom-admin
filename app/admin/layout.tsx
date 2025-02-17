"use client";

import Link from 'next/link';
import { ShoppingBag, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white p-6">
        <div className="flex items-center gap-2 mb-8">
          <ShoppingBag className="h-6 w-6" />
          <span className="font-bold text-xl">Admin Panel</span>
        </div>
        <nav className="space-y-4">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start text-white">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-white">
              <LogOut className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-100">
        <header className="bg-white shadow">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}