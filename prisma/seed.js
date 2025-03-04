import { PrismaClient } from "@prisma/client";
import { PRODUCT, ARTICLE, COMMENT } from "./mock.js";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.Comment.deleteMany();

  await prisma.product.createMany({
    data: PRODUCT,
    skipDuplicates: true,
  });

  await prisma.article.createMany({
    data: ARTICLE,
    skipDuplicates: true,
  });

  await prisma.comment.createMany({
    data: COMMENT,
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
