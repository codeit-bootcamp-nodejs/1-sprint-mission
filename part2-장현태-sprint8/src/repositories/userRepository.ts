import { User } from "@prisma/client";
import prisma from "../config/prisma";

async function getById(id: number) {
  return await prisma.user.findUnique({
    where: {
      id: id,
    },
  });
}

async function getByEmail(email: string) {
  return await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
}

async function save(user: {
  email: string;
  nickname: string;
  password: string;
  image: string;
}) {
  return await prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
      image: user.image,
    },
  });
}

async function update(
  id: number,
  data: {
    nickname?: string;
    image?: string;
    refreshToken?: string;
  }
) {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: data,
  });
}

async function changePassword(id: number, password: string) {
  return await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      password: password,
    },
  });
}

async function deleteById(id: number) {
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
