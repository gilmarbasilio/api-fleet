import fastify, {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";

import {
  IAddUserRequest,
  IDeleteUserRequest,
  IGetUserRequest,
  IUpdatePhotoRequest,
  IUpdateUserRequest,
} from "../types/user.types";
import {
  getUsersHandler,
  getUserHandler,
  addUserHandler,
  updateUserHandler,
  deleteUserHandler,
  updateUserPhotoHandler,
} from "../controllers/user.controller";

export const userRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // get all users
  app.route<IGetUserRequest>({
    url: '/',
    method: ['GET'],
    schema: {
      summary: 'Returns all Users',
      description: 'Returns all the user\'s data',
      tags: ['User'],
      // the response needs to be an object with an `hello` property of type 'string'
      response: {
        200: {
          description: 'Returns all the users',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                format: 'uuid'
              },
              name: {
                type: 'string'
              },
              createdAt: {
                type: 'string'
              },
              email: {
                type: 'string',
                format: 'email'
              }
            }
          }
        },
      },
      security: [
        {
          bearerAuth: []
        }
      ],
    },
    onRequest: [app.authenticate],
    handler: getUsersHandler,
  })

  app.route<IGetUserRequest>({
    url: '/:id',
    method: ['GET'],
    schema: {
      summary: 'Return a user',
      description: 'Return a user\'s data',
      tags: ['User'],
      // the response needs to be an object with an `hello` property of type 'string'
      response: {
        200: {
          description: 'Return a user',
          type: 'object',
          properties: {
            id: {
              type: 'number',
              format: 'uuid'
            },
            name: {
              type: 'string'
            },
            createdAt: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            }
          }
        },
      },
      security: [
        {
          bearerAuth: []
        }
      ],
    },
    onRequest: [app.authenticate],
    handler: getUserHandler,
  })

  // create a new user
  app.route<IAddUserRequest>({
    url: '/',
    method: ['POST'],
    schema: {
      summary: 'Create a user',
      description: 'Create a user\'s data',
      tags: ['User'],
      body: {
        type: 'object',
        description: 'Creates a user',
        properties: {
          name: {
            type: 'string'
          },
          password: {
            type: 'string'
          },
          email: {
            type: 'string',
            format: 'email'
          }
        }
      },
      response: {
        201: {
          description: 'User created',
          type: 'null',
        },
      },
      security: [
        {
          bearerAuth: []
        }
      ],
    },
    handler: addUserHandler,
  })

  app.route<IUpdateUserRequest>({
    url: '/:id',
    method: ['PUT'],
    schema: {
      summary: 'Update a user',
      description: 'Update a user\'s data',
      tags: ['User'],
      body: {
        type: 'object',
        description: 'Update a user',
        properties: {
          name: {
            type: 'string'
          },
          email: {
            type: 'string',
            format: 'email'
          }
        }
      },
      response: {
        204: {
          description: 'User updated',
          type: 'null',
        },
      },
      security: [
        {
          bearerAuth: []
        }
      ],
    },
    onRequest: [app.authenticate],
    handler: updateUserHandler,
  })

  // delete a user
  app.route<IDeleteUserRequest>({
    url: '/:id',
    method: ['DELETE'],
    schema: {
      summary: 'Delete a user',
      description: 'Delete a user\'s data',
      tags: ['User'],
      response: {
        204: {
          description: 'User deleted',
          type: 'null',
        },
      },
      security: [
        {
          bearerAuth: []
        }
      ],
    },
    onRequest: [app.authenticate],
    handler: deleteUserHandler,
  })

  // update photo user
  app.route<IUpdatePhotoRequest>({
    url: '/update-photo',
    method: ['POST'],
    schema: {
      summary: 'Update a user photo',
      description: 'Update a user photo\'s data',
      tags: ['User'],
      body: {
        type: 'object',
        description: 'Update a user',
        properties: {
          photo: {
            type: 'string'
          },
        }
      },
      response: {
        204: {
          description: 'User photo updated',
          type: 'null',
        },
      },
      security: [
        {
          bearerAuth: []
        }
      ],
    },
    onRequest: [app.authenticate],
    handler: updateUserPhotoHandler,
  })

};
