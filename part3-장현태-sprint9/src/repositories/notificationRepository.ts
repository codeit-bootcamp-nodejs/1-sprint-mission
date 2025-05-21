import prisma from "../config/prisma";

async function save(userId: number, type: string) {
  return await prisma.notification.create({
    data: {
      userId: userId,
      type: type,
      status: "unread",
    },
  });
}

async function getAllbyUserId(userId: number) {
  return await prisma.notification.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function getCountUnreadNotifications(userId: number) {
  return await prisma.notification.count({
    where: {
      userId: userId,
      status: "unread",
    },
  });
}

async function update(userId: number, notificationId: string) {
  return await prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId: userId,
    },
    data: {
      status: "read",
    },
  });
}

export default { getAllbyUserId, getCountUnreadNotifications, update, save };
