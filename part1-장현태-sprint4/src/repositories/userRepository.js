import prisma from "../config/prisma.js";

async function getById(id) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}

async function getByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

async function save(user) {
  return await prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
      image: user.image,
    },
  });
}

async function update(id, data) {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: data,
  });
}

async function changePassword(id, password) {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: password,
    },
  });
}

async function deleteById(id) {
  return await prisma.user.delete({
    where: {
      id: id,
    },
  });
}

export default {
  getById,
  getByEmail,
  save,
  changePassword,
  update,
  deleteById,
};
