"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: '',
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      
      // Log the form data being sent
      console.log('Form data before sending:', {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        hasFile: selectedFile !== null
      });

      // Append all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('category', formData.category);
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      } else if (formData.imageUrl) {
        formDataToSend.append('imageUrl', formData.imageUrl);
      }

      const endpoint = editingProduct 
        ? `http://localhost:5001/api/products/${editingProduct._id}`
        : 'http://localhost:5001/api/products';

      const response = await axios({
        method: editingProduct ? 'put' : 'post',
        url: endpoint,
        data: formDataToSend,
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Server response:', response.data);

      if (response.data) {
        toast.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
        
        setFormData({
          name: '',
          description: '',
          price: '',
          imageUrl: '',
          category: '',
        });
        setSelectedFile(null);
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (error: any) {
      console.error('Submit error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to process product');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.imageUrl,
      category: product.category,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <div>
            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full"
            />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            )}
          </div>
          <div>
            <Input
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
          <Button type="submit">
            {editingProduct ? (
              <>
                <Pencil className="w-4 h-4 mr-2" />
                Update Product
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="p-4">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600 mb-2">{product.description}</p>
            <p className="text-lg font-bold mb-2">${product.price}</p>
            <p className="text-sm text-gray-500 mb-4">{product.category}</p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEdit(product)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(product._id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}