import { prisma } from "@/lib/db/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PaymentMethodType } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderNumber, paymentMethod, deliveryInfo, items, totalPrice } = body;

    if (!orderNumber || !paymentMethod || !items || items.length === 0) {
      return NextResponse.json(
        { error: "缺少必要的訂單資訊" },
        { status: 400 }
      );
    }

    // Map payment method from frontend format to database enum
    const paymentMethodMap: Record<string, PaymentMethodType> = {
      "line-pay": PaymentMethodType.CREDIT_CARD, // 使用 Enum 成員
      "apple-pay": PaymentMethodType.APPLE_PAY,
      "credit-card": PaymentMethodType.CREDIT_CARD,
    };

    const dbPaymentMethod = paymentMethodMap[paymentMethod] || PaymentMethodType.CREDIT_CARD;

    // Calculate subtotal from items
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + parseFloat(item.price) * item.quantity,
      0
    );

    // Create order with items in a transaction
    const order = await prisma.order.create({
      data: {
        orderNumber,
        subtotal: subtotal.toString(),
        total: totalPrice.toString(),
        paymentMethod: dbPaymentMethod,
        estimatedTime: 15,
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            productName: item.nameZh,
            quantity: item.quantity,
            price: item.price.toString(),
            subtotal: (parseFloat(item.price) * item.quantity).toString(),
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        message: "訂單已成功建立",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "建立訂單失敗" },
      { status: 500 }
    );
  }
}
