import { Type } from "@prisma/client";
import prisma from "../config/prisma";

const getById = async (userId: number, id: number) => {
  return await prisma.notification.findUnique({ where: { userId, id } });
};

const update = async (userId: number, id: number) => {
  await prisma.notification.update({
    where: { userId, id },
    data: { isRead: true },
  });

  const unReadCount = await prisma.notification.count({
    where: { userId, isRead: false },
  });
  return unReadCount;
};

const save = async (userId: number, type: Type, content: string) => {
  return await prisma.notification.create({
    data: { userId, type, content, isRead: false },
  });
};

export default { getById, update, save };
