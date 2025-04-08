import { UpdateUser, User } from "../dto/index";
import { prismaClient } from "../lib/prismaClient";

async function getById(id: number) {
  return await prismaClient.user.findUnique({
    where: {
      id: id,
    },
  });
}

async function getByEmail(email: string) {
  return await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });
}

async function changePassword(id: number, password: string) {
  return await prismaClient.user.update({
    where: {
      id: id,
    },
    data: {
      password: password,
    },
  });
}

async function deleteById(id: number) {
  return await prismaClient.user.delete({
    where: {
      id: id,
    },
  });
}

async function update(id: number, data: UpdateUser) {
  return await prismaClient.user.update({
    where: {
      id: id,
    },
    data: data,
  });
}

async function save(user: User) {
  return await prismaClient.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
      image: user.image,
    },
  });
}

export default {
  deleteById,
  changePassword,
  update,
  save,
  getByEmail,
  getById,
};
