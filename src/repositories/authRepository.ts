import { User } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';
import { CreateUserDTO } from '../DTO/userDTO';

export async function findById(id: number): Promise<User | null> {
  return await prismaClient.user.findUnique({
    where: {
      id,
    },
  });
}

export async function findByEmail(email: string): Promise<User | null> {
  return await prismaClient.user.findUnique({
    where: {
      email,
    },
  });
}

export async function save(user: CreateUserDTO): Promise<User> {
  return await prismaClient.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
    },
  });
}

export async function update(id: number, data: User): Promise<User> {
  return await prismaClient.user.update({
    where: {
      id,
    },
    data: data,
  });
}
