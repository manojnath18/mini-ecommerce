'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const router = useRouter();
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (!loggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const prodRes = await fetch('https://api.freeapi.app/api/v1/ecommerce/products');
        const prodData = await prodRes.json();

        const orderRes = await fetch('https://api.freeapi.app/api/v1/ecommerce/orders');
        const orderData = await orderRes.json();

        // Check if prodData.data is an array before using length
        setProductsCount(Array.isArray(prodData?.data) ? prodData.data.length : 0);

        // Check if orderData.data is an array before using length
        setOrdersCount(Array.isArray(orderData?.data) ? orderData.data.length : 0);

        // Safely calculate revenue only if orderData.data is an array
        const revenue = Array.isArray(orderData?.data)
          ? orderData.data.reduce((sum: number, order: any) => sum + (order.total || 0), 0)
          : 0;

        setTotalRevenue(revenue);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 bg-gray-50">
      <div className="max-w-5xl w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{productsCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{ordersCount}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <h2 className="text-xl font-semibold">Products</h2>
              <p>View all products</p>
              <Link href="/admin/products">
                <Button>Go to Products</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <h2 className="text-xl font-semibold">Orders</h2>
              <p>View all orders placed</p>
              <Link href="/admin/orders">
                <Button>Go to Orders</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
