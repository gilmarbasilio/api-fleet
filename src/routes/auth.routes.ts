import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";

import { IAddUserRequest } from "../types/user.types";
import {
  loginHandler,
  userLoggedHandler,
} from "../controllers/auth.controller";

export const authRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
  options: FastifyPluginOptions
) => {
  app.post<IAddUserRequest>("/login", loginHandler);
  app.get<IAddUserRequest>(
    "/me",
    { onRequest: [app.authenticate] },
    userLoggedHandler
  );
};
