"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";

type PaymentMethod = "line-pay" | "apple-pay" | "credit-card";

interface OrderInfo {
  orderNumber: string;
  pickupTime: string;
  paymentMethod: PaymentMethod;
  deliveryInfo: {
    name: string;
    phone: string;
    address: string;
  };
  items: any[];
  totalPrice: number;
  timestamp: number;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, addOrder } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);

  const getPaymentMethodName = (method: PaymentMethod) => {
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

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-[#f8f6f2] text-foreground p-4 sm:p-8">
        <main className="max-w-md mx-auto">
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">購物車是空的</p>
            <Link href="/">
              <Button>繼續購物</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (orderPlaced && orderInfo) {
    return (
      <div className="min-h-screen bg-[#f8f6f2] text-foreground p-4 sm:p-8 flex items-center justify-center">
        <main className="max-w-md mx-auto w-full">
          <div className="bg-white rounded-3xl shadow-md p-8 text-center">
            {/* Illustration */}
            <div className="mb-6 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center text-5xl">
                🥟
              </div>
            </div>

            {/* Thank You Message */}
            <h1 className="text-3xl font-bold mb-2">感謝您！</h1>
            <p className="text-muted-foreground mb-6">您的黑暗料理正在準備中</p>

            {/* Order Details */}
            <div className="bg-[#f8f6f2] rounded-xl p-4 space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-[#e8e6e0]">
                <span className="text-muted-foreground">訂單編號</span>
                <span className="font-semibold">#{orderInfo.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#e8e6e0]">
                <span className="text-muted-foreground">取餐時間</span>
                <span className="font-semibold text-amber-500">{orderInfo.pickupTime}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#e8e6e0]">
                <span className="text-muted-foreground">收貨人</span>
                <span className="font-semibold">{orderInfo.deliveryInfo.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#e8e6e0]">
                <span className="text-muted-foreground">聯絡電話</span>
                <span className="font-semibold">{orderInfo.deliveryInfo.phone}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-[#e8e6e0]">
                <span className="text-muted-foreground">收貨地址</span>
                <span className="font-semibold text-sm text-right">{orderInfo.deliveryInfo.address}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">支付方式</span>
                <span className="font-semibold">{getPaymentMethodName(orderInfo.paymentMethod)}</span>
              </div>
            </div>

            {/* Back to Home Button */}
            <Link href="/">
              <Button className="w-full py-6 text-base rounded-full bg-amber-400 hover:bg-amber-500">
                返回首頁
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePayment = async () => {
    if (!paymentMethod) {
      alert("請選擇支付方式");
      return;
    }
    if (!formData.name || !formData.phone || !formData.address) {
      alert("請填寫收貨資訊");
      return;
    }

    // Generate order info
    const orderNumber = String(Math.floor(Math.random() * 1000000)).padStart(5, "0");
    const pickupMinMin = 15;
    const pickupMinMax = 20;
    const pickupTime = `${pickupMinMin}-${pickupMinMax} 分鐘`;
    
    const orderInfo = {
      orderNumber,
      pickupTime,
      paymentMethod,
      deliveryInfo: formData,
      items,
      totalPrice,
      timestamp: Date.now(),
    };

    try {
      // Save order to database
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: orderInfo.orderNumber,
          paymentMethod: orderInfo.paymentMethod,
          deliveryInfo: orderInfo.deliveryInfo,
          items: orderInfo.items,
          totalPrice: orderInfo.totalPrice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert("訂單保存失敗：" + (error.error || "未知錯誤"));
        return;
      }

      // Update local state after successful save
      setOrderInfo(orderInfo);
      addOrder(orderInfo);
      clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error("Error saving order:", error);
      alert("訂單保存失敗，請稍後重試");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f6f2] text-foreground p-4 sm:p-8">
      <main className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <Link href="/cart">
            <button className="p-2 bg-white rounded-full shadow hover:shadow-md transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Link>
          <h1 className="text-2xl font-bold">結帳</h1>
        </header>

        {/* Order Summary */}
        <section className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-semibold mb-3">訂單摘要</h2>
          <div className="space-y-2 mb-3 border-b pb-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span>{item.nameZh} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between font-semibold text-lg">
            <span>總計</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
        </section>

        {/* Delivery Information */}
        {!showOrderForm ? (
          <button
            onClick={() => setShowOrderForm(true)}
            className="w-full bg-white rounded-xl shadow-sm p-4 text-left hover:shadow-md transition mb-4"
          >
            <p className="text-muted-foreground text-sm">收貨資訊</p>
            <p className="font-semibold">編輯收貨地址</p>
          </button>
        ) : (
          <section className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <h2 className="font-semibold mb-3">收貨資訊</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-muted-foreground">姓名</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full border border-border rounded-lg p-2 mt-1"
                  placeholder="請輸入姓名"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">電話</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  className="w-full border border-border rounded-lg p-2 mt-1"
                  placeholder="請輸入電話"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">地址</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full border border-border rounded-lg p-2 mt-1"
                  placeholder="請輸入地址"
                  rows={3}
                />
              </div>
            </div>
          </section>
        )}

        {/* Payment Methods */}
        <section className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <h2 className="font-semibold mb-3">選擇支付方式</h2>
          <div className="space-y-2">
            {/* LINE Pay */}
            <button
              onClick={() => setPaymentMethod("line-pay")}
              className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-3 ${
                paymentMethod === "line-pay"
                  ? "border-green-500 bg-green-50"
                  : "border-border hover:border-green-300"
              }`}
            >
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                L
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">LINE Pay</p>
                <p className="text-xs text-muted-foreground">即時支付，安全快速</p>
              </div>
              {paymentMethod === "line-pay" && <div className="text-green-500">✓</div>}
            </button>

            {/* Apple Pay */}
            <button
              onClick={() => setPaymentMethod("apple-pay")}
              className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-3 ${
                paymentMethod === "apple-pay"
                  ? "border-gray-900 bg-gray-50"
                  : "border-border hover:border-gray-300"
              }`}
            >
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold">
                🍎
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">Apple Pay</p>
                <p className="text-xs text-muted-foreground">iOS 便捷支付</p>
              </div>
              {paymentMethod === "apple-pay" && <div className="text-gray-900">✓</div>}
            </button>

            {/* Credit Card */}
            <button
              onClick={() => setPaymentMethod("credit-card")}
              className={`w-full p-3 rounded-lg border-2 transition flex items-center gap-3 ${
                paymentMethod === "credit-card"
                  ? "border-blue-500 bg-blue-50"
                  : "border-border hover:border-blue-300"
              }`}
            >
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                💳
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold">信用卡</p>
                <p className="text-xs text-muted-foreground">Visa、Mastercard、JCB</p>
              </div>
              {paymentMethod === "credit-card" && <div className="text-blue-500">✓</div>}
            </button>
          </div>
        </section>

        {/* Checkout Button */}
        <div className="fixed left-1/2 transform -translate-x-1/2 bottom-4 w-[92%] max-w-md">
          <div className="bg-white rounded-2xl shadow-md p-4">
            <Button className="w-full" onClick={handlePayment}>
              完成支付 (${totalPrice.toFixed(2)})
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
