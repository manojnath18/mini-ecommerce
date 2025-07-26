'use client';

import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash, Minus, Plus } from 'lucide-react';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalPrice,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty 🛒</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border p-4 rounded-md shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <Image
                src={item.image}
                alt={item.title}
                width={80}
                height={80}
                className="object-contain"
              />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-muted-foreground text-sm">
                  ${item.price.toFixed(2)}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="px-2">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Item Total: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
            <Button variant="destructive" onClick={() => removeFromCart(item.id)}>
              <Trash className="w-4 h-4 mr-1" /> Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <h4 className="text-2xl font-bold">
          Total: <span className="text-green-600">${getTotalPrice().toFixed(2)}</span>
        </h4>
        <Link href="/checkout">
          <Button className="mt-4">Proceed to Checkout</Button>
        </Link>
      </div>
    </div>
  );
}
