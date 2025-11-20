import { prisma } from "@/lib/db/prisma";
import ProductList from "@/app/components/ProductList";
import { Prisma } from "@prisma/client";

export default async function Home() {
  // Fetch all products from database
  const products = await prisma.product.findMany({
    where: {
      isAvailable: true,
    },
    select: {
      id: true,
      nameZh: true,
      description: true,
      price: true,
      image: true,
      category: true,
      isPopular: true,
      isBreakfast: true,
      isDinner: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Convert Decimal to string for serialization
  const serializedProducts = products.map((p: typeof products[0]) => ({
    ...p,
    price: p.price.toString(),
  }));

  return <ProductList products={serializedProducts} />;
}
