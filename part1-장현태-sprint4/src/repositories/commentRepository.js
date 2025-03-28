import prisma from "../config/prisma.js";

async function getAll() {
  return await prisma.comment.findMany();
}

async function getById(id) {
  return await prisma.comment.findUnique({
    where: { id },
  });
}

async function save(userId, content) {
  return await prisma.comment.create({
    data: {
      ...content,
      author: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

async function update(id, content) {
  return await prisma.comment.update({
    where: { id },
    data: {
      ...content,
    },
  });
}

async function deleteById(id) {
  return prisma.comment.delete({
    where: { id },
  });
}

export default {
  getAll,
  getById,
  update,
  save,
  deleteById,
};
