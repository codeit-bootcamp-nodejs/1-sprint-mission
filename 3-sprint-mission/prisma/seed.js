import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("시딩...");

  await prisma.product.createMany({
    data: [
      {
        name: "맥북 프로 16인치",
        description: "애플 M1 칩셋 장착",
        price: 3500000,
        tags: ["전자제품", "노트북"],
      },
      {
        name: "아이폰 14 프로",
        description: "다이나믹 아일랜드 탑재",
        price: 1500000,
        tags: ["전자제품", "스마트폰"],
      },
      {
        name: "PS5",
        description: "소니 플레이스테이션 5",
        price: 600000,
        tags: ["게임기", "콘솔"],
      },
      {
        name: "닌텐도 스위치",
        description: "휴대용 게임기",
        price: 400000,
        tags: ["게임기", "닌텐도"],
      },
    ],
  });

  await prisma.article.createMany({
    data: [
      {
        title: "첫 번째 게시글",
        content: "이것은 첫 번째 게시글의 내용입니다.",
      },
      {
        title: "두 번째 게시글",
        content: "두 번째 게시글의 내용입니다. 환영합니다!",
      },
      {
        title: "세 번째 게시글",
        content: "자유게시판에 오신 것을 환영합니다!",
      },
    ],
  });

  console.log("시딩 완료");
}

main()
  .catch((error) => {
    console.error("시딩 중 오류 발생:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
