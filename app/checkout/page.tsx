'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';  // import your cart context

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart, getTotalPrice } = useCart(); // use cart context

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      alert('Please fill all fields');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Prepare order data
    const newOrder = {
      id: Date.now(), // unique id
      customer: form,
      items: cartItems,
      total: getTotalPrice(),
      date: new Date().toISOString(),
    };

    // Get existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');

    // Append new order
    existingOrders.push(newOrder);

    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Clear cart after placing order
    clearCart();

    // Redirect to success page
    router.push('/success');
  };

  return (
    <div className="container mx-auto max-w-lg p-6 mt-12 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-semibold">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="address" className="block mb-1 font-semibold">Address</label>
          <textarea
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <Button type="submit" className="w-full">Place Order</Button>
      </form>
    </div>
  );
}
