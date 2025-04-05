import { prismaClient } from "../middlewares/prismaClient.js";

async function findById(id) {
  return await prismaClient.user.findUnique({
    where: {
      id,
    },
  });
}

async function findByEmail(email) {
  return await prismaClient.user.findUnique({
    where: {
      email,
    },
  });
}

async function save(user) {
  return await prismaClient.user.create({
    data: {
      email: user.email,
      nickName: user.nickName,
      password: user.password,
    },
  });
}

async function update(id, data) {
  return await prismaClient.user.update({
    where: {
      id,
    },
    data: data,
  });
}

async function createOrUpdate(provider, providerId, email, name) {
  return await prismaClient.user.upsert({
    where: { provider, providerId },
    update: { email, name },
    create: { provider, providerId, email, name },
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
  createOrUpdate,
};
