"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/context/CartContext";
import { Order } from "@/app/context/CartContext";

export default function OrdersPage() {
  const { orders } = useCart();

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case "line-pay":
        return "LINE Pay";
      case "apple-pay":
        return "Apple Pay";
      case "credit-card":
        return "信用卡";
      default:
        return "";
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          <h1 className="text-2xl font-bold">歷史訂單</h1>
        </header>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-md p-8 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-4xl">
                📋
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">還沒有訂單</h2>
            <p className="text-muted-foreground mb-6">開始訂購難吃的料理吧!</p>
            <Link href="/">
              <Button className="w-full py-6 text-base rounded-full bg-amber-400 hover:bg-amber-500">
                返回首頁
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.orderNumber} className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition">
                {/* Order Header */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-lg">訂單 #{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(order.timestamp)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-500">${order.totalPrice.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">{order.items.length} 項商品</p>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="bg-[#f8f6f2] rounded-lg p-3 mb-3 text-sm space-y-1">
                  {order.items.slice(0, 2).map((item: any) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.nameZh} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-muted-foreground text-xs">... 還有 {order.items.length - 2} 項</p>
                  )}
                </div>

                {/* Order Details */}
                <div className="space-y-2 mb-3 border-t pt-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">取餐時間</span>
                    <span className="font-semibold">{order.pickupTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">支付方式</span>
                    <span className="font-semibold">{getPaymentMethodName(order.paymentMethod)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">收貨人</span>
                    <span className="font-semibold">{order.deliveryInfo.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">電話</span>
                    <span>{order.deliveryInfo.phone}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">地址</span>
                    <span className="text-right max-w-[150px]">{order.deliveryInfo.address}</span>
                  </div>
                </div>

                {/* Reorder Button */}
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full text-sm">
                    再次訂購
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
