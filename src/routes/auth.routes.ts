import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";

import { IAddUserRequest } from "../types/user.types";
import { loginHandler } from "../controllers/auth.controller";

export const authRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
  options: FastifyPluginOptions
) => {
  app.post<IAddUserRequest>("/login", loginHandler);
};
