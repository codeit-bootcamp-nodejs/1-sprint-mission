import prisma from '../lib/prismaClient.js';

async function getById(id) {
  return await prisma.article.findUnique({
    where: {
      id: parseInt(id, 12),
    },
  });
}

async function getList(where) {
  return await prisma.article.findMany(where);
}

async function create(article) {
  return await prisma.article.create({
    data: article,
  });
}

async function update(id, data) {
  return await prisma.article.update({
    where: {
      id,
    },
    data: data,
  });
}

async function remove(id) {
  return await prisma.article.delete({
    where: {
      id: parseInt(id, 12),
    },
  });
}

async function count(where) {
  return await prisma.article.count(where);
}

function getEntityName() {
  return prisma.article.getEntityName();
}

export default {
  getById,
  create,
  update,
  remove,
  getEntityName,
  count,
  getList,
};