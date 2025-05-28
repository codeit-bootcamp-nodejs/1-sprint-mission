import prisma from "../config/prisma";

async function getMany() {
  return await prisma.comment.findMany();
}

async function getById(id: string) {
  return await prisma.comment.findUnique({
    where: { id },
  });
}

async function save(
  userId: number,
  commentData: {
    content: string;
    article?: {
      connect: {
        id: string;
      };
    };
    product?: {
      connect: {
        id: string;
      };
    };
  }
) {
  return await prisma.comment.create({
    data: {
      ...commentData,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

async function update(id: string, data: { content: string }) {
  return await prisma.comment.update({
    where: { id },
    data,
  });
}

async function deleteById(id: string) {
  return prisma.comment.delete({
    where: { id },
  });
}

export default {
  getMany,
  getById,
  update,
  save,
  deleteById,
};