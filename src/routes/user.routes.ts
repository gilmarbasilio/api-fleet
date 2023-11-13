import fastify, {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";

import {
  IAddUserRequest,
  IDeleteUserRequest,
  IGetUserRequest,
  IUpdateUserRequest,
} from "../types/user.types";
import {
  getUsersHandler,
  getUserHandler,
  addUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from "../controllers/user.controller";

export const userRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // get all users
  app.get("/", { onRequest: [app.authenticate] }, getUsersHandler);

  // get a user
  app.get<IGetUserRequest>(
    "/:id",
    { onRequest: [app.authenticate] },
    getUserHandler
  );

  // create a new user
  app.post<IAddUserRequest>("/", addUserHandler);

  // update a user
  app.put<IUpdateUserRequest>(
    "/:id",
    { onRequest: [app.authenticate] },
    updateUserHandler
  );

  // delete a user
  app.delete<IDeleteUserRequest>(
    "/:id",
    { onRequest: [app.authenticate] },
    deleteUserHandler
  );
};
