import { PrismaClient } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { IAddUserRequest } from "../types/user.types";
import { z } from "zod";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const loginHandler = async (
  request: FastifyRequest<IAddUserRequest>,
  reply: FastifyReply
) => {
  const loginScrema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = loginScrema.parse(request.body);

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    return reply.status(400).send(new Error("User does not exist"));
  }

  const passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    return reply.status(400).send(new Error("Email or password is incorrect"));
  }

  const token = await reply.jwtSign({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  reply.status(200).send({ token });
};

export const userLoggedHandler = async (
  request: FastifyRequest<IAddUserRequest>,
  reply: FastifyReply
) => {
  const user = await prisma.user.findFirst({
    where: { id: request.user?.id },
  });

  return reply.status(200).send({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    photo: user?.photo
  });
};
