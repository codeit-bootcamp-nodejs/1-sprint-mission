import prisma from '../lib/prismaClient.js';

async function create(comment) {
  return await prisma.comment.create({
    data: comment,
  });
}

async function getById(id) {
  return await prisma.comment.findUnique({
    where: {
      id: parseInt(id, 12),
    },
  });
}

async function getAll() {
  return await prisma.comment.findMany();
}

async function getList(data) {
  return await prisma.comment.findMany(data);
}

async function update(id, data) {
  return await prisma.comment.update({
    where: {
      id: parseInt(id, 12),
    },
    data: data,
  });
}

async function deleteById(id) {
  return await prisma.comment.delete({
    where: {
      id: parseInt(id, 12),
    },
  });
}

function getEntityName() {
  return prisma.comment.getEntityName();
}

export default {
  create,
  getById,
  getAll,
  getList,
  update,
  deleteById,
  getEntityName,
};