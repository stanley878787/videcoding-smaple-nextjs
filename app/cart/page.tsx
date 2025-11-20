"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-foreground p-4 sm:p-8">
      <main className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <Link href="/">
            <button className="p-2 bg-white rounded-full shadow hover:shadow-md transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Link>
          <h1 className="text-2xl font-bold">購物車</h1>
        </header>

        {/* Cart Items */}
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">購物車是空的</p>
            <Link href="/">
              <Button>繼續購物</Button>
            </Link>
          </div>
        ) : (
          <>
            <section className="space-y-3 mb-32">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3">
                  <img src={item.image} alt={item.nameZh} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.nameZh}</h3>
                    <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-[#f3eede] rounded-full flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <div className="min-w-[20px] text-center text-sm">{item.quantity}</div>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-[#f3eede] rounded-full flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      移除
                    </button>
                  </div>
                </div>
              ))}
            </section>

            {/* Bottom checkout bar */}
            <div className="fixed left-1/2 transform -translate-x-1/2 bottom-4 w-[92%] max-w-md">
              <div className="bg-white rounded-2xl shadow-md p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="font-semibold text-lg">${totalPrice.toFixed(2)}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="text-sm"
                    >
                      清空
                    </Button>
                    <Link href="/checkout">
                      <Button className="text-sm">結帳</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
