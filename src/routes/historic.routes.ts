import {
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
  addHistoricHandler,
  checkInHistoricHandler,
  deleteHistoricHandler,
  getCarInUseHandler,
  getHistoricHandler,
  getHistoriesHandler,
  updateHistoricHandler,
} from "../controllers/historic.controller";

export const historicRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // get all histories
  app.get("/", { onRequest: [app.authenticate] }, getHistoriesHandler);

  // get a historic
  app.get<IGetUserRequest>(
    "/:id",
    { onRequest: [app.authenticate] },
    getHistoricHandler
  );

  // create a new historic
  app.post<IAddUserRequest>(
    "/",
    { onRequest: [app.authenticate] },
    addHistoricHandler
  );

  // update a historic
  app.put<IUpdateUserRequest>(
    "/:id",
    { onRequest: [app.authenticate] },
    updateHistoricHandler
  );

  // delete a historic
  app.delete<IDeleteUserRequest>(
    "/:id",
    { onRequest: [app.authenticate] },
    deleteHistoricHandler
  );

  // update a historic
  app.put<IUpdateUserRequest>(
    "/:id/check-in",
    { onRequest: [app.authenticate] },
    checkInHistoricHandler
  );

  app.get(
    "/get-car-in-use",
    { onRequest: [app.authenticate] },
    getCarInUseHandler
  );
};
