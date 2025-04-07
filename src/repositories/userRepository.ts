import prisma from "../config/prisma";
import { User } from "@prisma/client";

async function findById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email },
  });
}

async function save(
  user: Pick<User, "email" | "nickname" | "password">
): Promise<User> {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    },
  });
}

async function update(
  id: string,
  data: Partial<Omit<User, "id">>
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

export default {
  findById,
  findByEmail,
  save,
  update,
};
