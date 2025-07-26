import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="container max-w-md p-6 bg-white rounded-md shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-green-600">Order Successful!</h1>
        <p className="mb-6 font-bold">Thank you for your purchase. Your order has been placed successfully.</p>
        <Link href="/">
        <div>
          <Button>Back to Home</Button>
        </div>
        </Link>
      </div>
    </div>
  );
}
