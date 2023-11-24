import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { User } from "../types/user.types";
import { z } from "zod";
import {
  IAddHistoricRequest,
  IDeleteHistoricRequest,
  IGetHistoricRequest,
  IGetHistoriesRequest,
  IUpdateHistoricRequest,
} from "../types/historic.types";

const prisma = new PrismaClient();

export const getHistoriesHandler = async (
  request: FastifyRequest<IGetHistoriesRequest>,
  reply: FastifyReply
) => {
  const { skip = 0, take = 10, status = undefined } = request.query;

  const user = request.user as User;
  const users = await prisma.historic.findMany({
    where: {
      userId: user?.id,
      status,
    },
    include: {
      coords: {
        select: {
          id: true,
          latitude: true,
          longitude: true,
          timestamp: true,
        },
      },
    },
    skip: Number(skip),
    take: Number(take),
  });
  reply.send(users);
};

export const getHistoricHandler = async (
  request: FastifyRequest<IGetHistoricRequest>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send(new Error("Está faltando o id do histórico"));
  }

  const historic = await prisma.historic.findUnique({
    where: { id },
    include: {
      coords: {
        select: {
          id: true,
          latitude: true,
          longitude: true,
          timestamp: true,
        },
      },
    },
  });

  if (!historic) {
    return reply.status(400).send(new Error("Histórico não encontrado"));
  }

  return reply.send(historic);
};

export const addHistoricHandler = async (
  request: FastifyRequest<IAddHistoricRequest>,
  reply: FastifyReply
) => {
  const user = request.user as User;
  const createHistoricScrema = z.object({
    licensePlate: z.string(),
    description: z.string(),
    coords: z
      .array(
        z.object({
          latitude: z.number(),
          longitude: z.number(),
          timestamp: z.number(),
        })
      )
      .min(1)
      .optional(),
  });

  const {
    licensePlate,
    description,
    coords = [],
  } = createHistoricScrema.parse(request.body);

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
  request: FastifyRequest<IUpdateHistoricRequest>,
  reply: FastifyReply
) => {
  const { id } = request.params;
  const user = request.user as User;

  if (!id) {
    return reply.status(400).send(new Error("Está faltando o id do histórico"));
  }

  const updateHistoricScrema = z.object({
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

  const { licensePlate, description, coords } = updateHistoricScrema.parse(
    request.body
  );

  const historic = await prisma.historic.update({
    data: {
      licensePlate: licensePlate,
      description: description,
      status: "arrived",
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
    where: {
      id,
    },
  });

  if (!historic) {
    return reply.status(400).send(new Error("Histórico não existe"));
  }

  return reply.status(204).send();
};

export const deleteHistoricHandler = async (
  request: FastifyRequest<IDeleteHistoricRequest>,
  reply: FastifyReply
) => {
  const { id } = request.params;

  if (!id) {
    return reply.status(400).send(new Error("Histórico não existe"));
  }

  await prisma.historic.delete({
    where: { id },
  });

  return reply.status(204).send();
};

export const checkOutHistoricHandler = async (
  request: FastifyRequest<IUpdateHistoricRequest>,
  reply: FastifyReply
) => {
  const updateHistoricScrema = z.object({
    id: z.string(),
    coords: z.array(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        timestamp: z.number(),
      })
    ),
  });

  const { id, coords } = updateHistoricScrema.parse(request.body);

  const historic = await prisma.historic.update({
    data: {
      status: "arrived",
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
    where: {
      id,
    },
  });

  if (!historic) {
    return reply.status(400).send(new Error("Histórico não existe"));
  }

  return reply.status(204).send();
};

export const getCarInUseHandler = async (
  request: FastifyRequest<IGetHistoricRequest>,
  reply: FastifyReply
) => {
  const user = request.user as User;
  const historic = await prisma.historic.findFirst({
    where: {
      userId: user.id,
      status: "departed",
    },
  });

  return reply.send(historic);
};
