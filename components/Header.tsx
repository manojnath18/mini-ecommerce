"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";

const Header = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
      {/* Logo & Title */}
      <div className="flex items-center gap-2">
        <Link href="/">
          <h1 className="text-xl font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors">
            MyShop
          </h1>
        </Link>
      </div>

      {/* Search */}
      <div className="flex-1 mx-4 max-w-xl">
        <Input
          type="text"
          placeholder="Search products..."
          className="w-full rounded-md border-gray-300"
        />
      </div>

      {/* Right Buttons */}
      <div className="flex items-center gap-x-2">
        <Link href="/cart" className="relative flex items-center">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-primary" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold w-5 h-5">
              {cartCount}
            </span>
          )}
        </Link>

        <Link href="/signin">
          <Button className="cursor-pointer" variant="outline" size="sm">
            Sign In
          </Button>
        </Link>

        <Link href="/signup">
          <Button className="cursor-pointer" size="sm">
            Sign Up
          </Button>
        </Link>

        <Link href="/admin/login">
          <Button className="cursor-pointer" variant="ghost" size="sm">
            Admin Panel
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;