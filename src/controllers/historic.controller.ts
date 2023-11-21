import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import {
  IAddUserRequest,
  IDeleteUserRequest,
  IGetUserRequest,
  IUpdateUserRequest,
  User,
} from "../types/user.types";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const getHistoriesHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const user = request.user as User;
  const users = await prisma.historic.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      coords: true,
    },
  });
  reply.send(users);
};

export const getHistoricHandler = async (
  request: FastifyRequest<IGetUserRequest>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send(new Error("Está faltando o id do histórico"));
  }

  const historic = await prisma.historic.findUnique({
    where: { id },
    select: {
      coords: true,
    },
  });

  if (!historic) {
    return reply.status(400).send(new Error("Histórico não encontrado"));
  }

  return reply.send(historic);
};

export const addHistoricHandler = async (
  request: FastifyRequest<IAddUserRequest>,
  reply: FastifyReply
) => {
  const user = request.user as User;
  const createUserScrema = z.object({
    licensePlate: z.string(),
    description: z.string(),
    coords: z.array(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        timestamp: z.number(),
      })
    ),
  });

  const { licensePlate, description, coords } = createUserScrema.parse(
    request.body
  );

  const historicExists = await prisma.historic.findFirst({
    where: { licensePlate, status: "departed" },
  });

  if (historicExists) {
    return reply
      .status(400)
      .send(
        new Error("Existe um registro com a placa informada que está em uso")
      );
  }

  await prisma.historic.create({
    data: {
      licensePlate: licensePlate,
      description: description,
      status: "departed",
      userId: String(user?.id),
      coords: {
        create: coords.map((coord) => {
          return {
            latitude: coord.latitude,
            longitude: coord.longitude,
            timestamp: coord.timestamp,
          };
        }),
      },
    },
  });

  reply.status(201).send();
};

export const updateHistoricHandler = async (
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

export const deleteHistoricHandler = async (
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
