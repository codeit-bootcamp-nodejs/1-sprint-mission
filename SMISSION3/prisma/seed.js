import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: "Laptop",
      description: "A high-end gaming laptop",
      price: 1200000,
      tags: ["electronics", "gaming"],
    },
  });

  await prisma.article.create({
    data: {
      title: "Welcome to the forum!",
      content: "This is a community-driven discussion board.",
    },
  });
}

main()
  .then(() => {
    console.log("Database seeded successfully");
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
