'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type Order = {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  products: {
    _id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  totalPrice: number;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://api.freeapi.app/api/v1/ecommerce/orders');
      const json = await res.json();
      console.log('Orders API response:', json);

      if (json?.data?.orders && Array.isArray(json.data.orders)) {
        setOrders(json.data.orders);
      } else {
        console.warn('Unexpected orders API response format', json);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading orders...</div>;

  if (orders.length === 0)
    return <div className="p-6 text-center">No orders found.</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin - Orders</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order._id} className="p-4">
            <h2 className="text-lg font-semibold mb-2">Order ID: {order._id}</h2>
            <div className="mb-4">
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Email:</strong> {order.customerEmail}</p>
              <p><strong>Address:</strong> {order.customerAddress}</p>
            </div>
            <Separator className="my-2" />
            <div>
              <h3 className="font-semibold mb-2">Products:</h3>
              <ul className="list-disc list-inside space-y-1">
                {order.products.map((prod) => (
                  <li key={prod._id}>
                    {prod.name} — ${prod.price.toFixed(2)} × {prod.quantity}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-bold">
                Total Price: ${order.totalPrice.toFixed(2)}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
