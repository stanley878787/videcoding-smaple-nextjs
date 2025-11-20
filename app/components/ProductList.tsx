"use client";

import { motion } from "framer-motion";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { useCart } from "@/app/context/CartContext";

interface Product {
  id: string;
  nameZh: string;
  description: string;
  price: string | number;
  image: string;
  category: string;
  isPopular?: boolean;
  isBreakfast?: boolean;
  isDinner?: boolean;
}

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const { addItem, updateQuantity, items, totalPrice } = useCart();
  const [category, setCategory] = useState<string>("breakfast");
  const [selectedQty, setSelectedQty] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    products.forEach((p) => (initial[p.id] = 0));
    return initial;
  });

  function incQty(id: string) {
    const newQty = (selectedQty[id] || 0) + 1;
    setSelectedQty((s) => ({ ...s, [id]: newQty }));

    // Add to cart when incrementing from 0 to 1
    if ((selectedQty[id] || 0) === 0) {
      const product = products.find((p) => p.id === id);
      if (product) {
        addItem({
          id: product.id,
          nameZh: product.nameZh,
          price: typeof product.price === "string" ? parseFloat(product.price) : product.price,
          image: product.image,
        });
      }
    } else {
      // Update quantity in cart if already exists
      const price = typeof products.find((p) => p.id === id)?.price === "string"
        ? parseFloat(products.find((p) => p.id === id)?.price as string)
        : products.find((p) => p.id === id)?.price;
      updateQuantity(id, newQty);
    }
  }

  function decQty(id: string) {
    const newQty = Math.max(0, (selectedQty[id] || 0) - 1);
    setSelectedQty((s) => ({ ...s, [id]: newQty }));

    // Update cart quantity or remove if it reaches 0
    updateQuantity(id, newQty);
  }

  // Filter products by category using database flags
  const filtered = useMemo(() => {
    if (category === "popular") {
      return products.filter((p) => p.isPopular === true);
    } else if (category === "breakfast") {
      return products.filter((p) => p.isBreakfast === true);
    } else if (category === "dinner") {
      return products.filter((p) => p.isDinner === true);
    }
    return products;
  }, [products, category]);

  const price = (p: number | string) => {
    return typeof p === "string" ? parseFloat(p) : p;
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-foreground p-4 sm:p-8">
      <main className="max-w-md mx-auto bg-transparent">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">黑暗料理家</h1>
            <p className="text-sm text-muted-foreground">開啟您美味的一天</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/orders">
              <button className="relative p-2 bg-white rounded-full shadow hover:shadow-md transition" title="查看歷史訂單">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#111827" />
                </svg>
              </button>
            </Link>
            <Link href="/cart">
              <button className="relative p-2 bg-white rounded-full shadow hover:shadow-md transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 6L6.6 4.2C6.8 3.6 7.4 3.2 8 3.2H16C16.6 3.2 17.2 3.6 17.4 4.2L18 6" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 6H21L20 19C19.9 20.2 18.9 21.2 17.7 21.2H6.3C5.1 21.2 4.1 20.2 4 19L3 6Z" stroke="#111827" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] px-1 rounded-full">{items.length}</span>
                )}
              </button>
            </Link>
          </div>
        </header>

        {/* Filter pills */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setCategory("popular")}
            className={`px-3 py-1 rounded-full text-sm transition ${category === "popular" ? "bg-amber-400 text-white" : "bg-white text-foreground"
              }`}
          >
            熱門商品
          </button>
          <button
            onClick={() => setCategory("breakfast")}
            className={`px-3 py-1 rounded-full text-sm transition ${category === "breakfast" ? "bg-amber-400 text-white" : "bg-white text-foreground"
              }`}
          >
            早餐
          </button>
          <button
            onClick={() => setCategory("dinner")}
            className={`px-3 py-1 rounded-full text-sm transition ${category === "dinner" ? "bg-amber-400 text-white" : "bg-white text-foreground"
              }`}
          >
            晚餐
          </button>
        </div>

        {/* List */}
        <section className="space-y-3 pb-32">
          <motion.div
            key={category}
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-sm p-3 flex items-center gap-3 mb-3"
              >
                <img src={product.image} alt={product.nameZh} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{product.nameZh}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="font-semibold">${price(product.price).toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decQty(product.id)}
                        className="w-8 h-8 bg-[#f3eede] rounded-full flex items-center justify-center hover:bg-[#e6e1d1] transition-colors"
                      >
                        -
                      </button>
                      <div className="min-w-[24px] text-center">{selectedQty[product.id] ?? 0}</div>
                      <button
                        onClick={() => incQty(product.id)}
                        className="w-8 h-8 bg-[#f3eede] rounded-full flex items-center justify-center hover:bg-[#e6e1d1] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Bottom checkout bar */}
        <div className="fixed left-1/2 transform -translate-x-1/2 bottom-4 w-[92%] max-w-md">
          <div className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">總計</div>
              <div className="font-semibold">${totalPrice.toFixed(2)}</div>
            </div>
            <Link href="/cart">
              <Button>檢視購物車</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
