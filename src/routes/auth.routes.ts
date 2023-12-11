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
  app.route<IAddUserRequest>({
    url: "/login",
    method: ["POST"],
    schema: {
      summary: "Login a user",
      description: "Login a user",
      tags: ["Auth"],
      body: {
        type: "object",
        description: "Login a user",
        properties: {
          password: {
            type: "string",
          },
          email: {
            type: "string",
            format: "email",
          },
        },
      },
      response: {
        200: {
          description: "Login successful",
          type: "object",
          properties: {
            token: {
              type: "string",
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    handler: loginHandler,
  });

  app.route<IAddUserRequest>({
    url: "/me",
    method: ["GET"],
    schema: {
      summary: "Return a user logged data",
      description: "Return a user logged data",
      tags: ["Auth"],
      response: {
        200: {
          description: "Return a user logged data",
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            name: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    onRequest: [app.authenticate],
    handler: userLoggedHandler,
  });
};
