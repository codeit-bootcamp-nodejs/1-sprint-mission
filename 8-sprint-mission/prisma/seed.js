import { PrismaClient } from "@prisma/client";
import {
  users,
  products,
  articles,
  comments,
  likes,
  favorites,
} from "./mock.js";
const prisma = new PrismaClient();
async function main() {
  await prisma.like.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });

  const productData = products.map((p, idx) => ({
    ...p,
    userId: 1,
  }));

  await prisma.product.createMany({
    data: productData,
    skipDuplicates: true,
  });

  const articleData = articles.map((a) => ({
    ...a,
    userId: 2,
  }));

  await prisma.article.createMany({
    data: articleData,
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: comments,
    skipDuplicates: true,
  });

  await prisma.$executeRaw`
  SELECT setval(pg_get_serial_sequence('\"Comment\"', 'id'), (SELECT COALESCE(MAX(id), 1) FROM \"Comment\"));`;

  await prisma.favorite.createMany({
    data: favorites,
    skipDuplicates: true,
  });

  await prisma.like.createMany({
    data: likes,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    console.log("seeding complete.");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("seeding failed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
