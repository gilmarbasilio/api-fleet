import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  IAddUserRequest,
  IDeleteUserRequest,
  IGetUserRequest,
  IUpdateUserRequest,
} from "../types/user.types";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getUsersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });
  reply.send(users);
};

export const getUserHandler = async (
  request: FastifyRequest<IGetUserRequest>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send(new Error("User id is missing"));
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id },
  });

  if (!user) {
    return reply.status(400).send(new Error("User not found"));
  }

  return reply.send(user);
};

export const addUserHandler = async (
  request: FastifyRequest<IAddUserRequest>,
  reply: FastifyReply
) => {
  const createUserScrema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  });

  const { email, name, password } = createUserScrema.parse(request.body);

  const userExists = await prisma.user.findFirst({
    where: { email },
  });

  if (userExists) {
    return reply
      .status(400)
      .send(new Error("Exists user registered with this email"));
  }

  const passwordEncrypted = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      password: passwordEncrypted,
    },
  });

  reply.status(201).send();
};

export const updateUserHandler = async (
  request: FastifyRequest<IUpdateUserRequest>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send(new Error("User id is missing"));
  }

  const updateUserScrema = z.object({
    name: z.string(),
    email: z.string().email(),
  });

  const { email, name } = updateUserScrema.parse(request.body);

  const user = await prisma.user.update({
    data: {
      email,
      name,
    },
    where: {
      id,
    },
  });

  if (!user) {
    return reply.status(400).send(new Error("User doesn't exist"));
  }

  return reply.status(204).send();
};

export const deleteUserHandler = async (
  request: FastifyRequest<IDeleteUserRequest>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send(new Error("User id is missing"));
  }

  await prisma.user.delete({
    where: { id },
  });

  return reply.status(204).send();
};
