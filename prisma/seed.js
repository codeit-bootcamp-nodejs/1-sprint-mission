import { PrismaClient } from "@prisma/client";
import { PRODUCTS, ARTICLES, COMMENTS } from "./mock.js"; // mock.js에서 데이터 불러오기

const prisma = new PrismaClient();

async function main() {
  console.log("데이터 시딩 시작...");

  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: PRODUCTS,
    skipDuplicates: true,
  });

  await prisma.article.createMany({
    data: ARTICLES,
    skipDuplicates: true,
  });

  await Promise.all(
    COMMENTS.map(async (comment) => {
      await prisma.comment.create({ data: comment });
    })
  );

  console.log("데이터 시딩 완료!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
