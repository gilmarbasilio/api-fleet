import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
} from "fastify";

import {
  addHistoricHandler,
  checkOutHistoricHandler,
  deleteHistoricHandler,
  getCarInUseHandler,
  getHistoricHandler,
  getHistoriesHandler,
  updateHistoricHandler,
} from "../controllers/historic.controller";

import {
  IAddHistoricRequest,
  IDeleteHistoricRequest,
  IGetHistoricRequest,
  IGetHistoriesRequest,
  IUpdateHistoricRequest
} from "../types/historic.types";

export const historicRoutes: FastifyPluginAsync = async (
  app: FastifyInstance,
  options: FastifyPluginOptions
) => {
  // get all histories
  app.route<IGetHistoriesRequest>({
    url: '/',
    method: ['GET'],
    schema: {
      summary: 'Returns all Histories',
      description: 'Returns all the histories\'s data',
      tags: ['Histories'],
      response: {
        200: {
          description: 'Returns all the histories',
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                format: 'uuid'
              },
              licensePlate: {
                type: 'string'
              },
              description: {
                type: 'string'
              },
              status: {
                type: 'string'
              },
              userId: {
                type: 'string'
              },
              createdAt: {
                type: 'string'
              },
              updatedAt: {
                type: 'string'
              },
              email: {
                type: 'string',
                format: 'email'
              },
              coords: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'number',
                    },
                    latitude: {
                      type: 'number',
                    },
                    longitude: {
                      type: 'number',
                    },
                    timestamp: {
                      type: 'number',
                    },
                  }
                }
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
    handler: getHistoriesHandler,
  })

  // get a historic
  app.route<IGetHistoricRequest>({
    url: '/:id',
    method: ['GET'],
    schema: {
      summary: 'Returns a Historic',
      description: 'Return a historic\'s data',
      tags: ['Histories'],
      response: {
        200: {
          description: 'Returns a Historic',
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            licensePlate: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            status: {
              type: 'string'
            },
            userId: {
              type: 'string'
            },
            createdAt: {
              type: 'string'
            },
            updatedAt: {
              type: 'string'
            },
            email: {
              type: 'string',
              format: 'email'
            },
            coords: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: {
                    type: 'number',
                  },
                  latitude: {
                    type: 'number',
                  },
                  longitude: {
                    type: 'number',
                  },
                  timestamp: {
                    type: 'number',
                  },
                }
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
    handler: getHistoricHandler,
  })

  app.route<IAddHistoricRequest>({
    url: '/',
    method: ['POST'],
    schema: {
      summary: 'Create a historic',
      description: 'Create a historic',
      tags: ['Histories'],
      body: {
        type: 'object',
        description: 'Create a historic',
        properties: {
          licensePlate: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          coords: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'number',
                },
                longitude: {
                  type: 'number',
                },
                timestamp: {
                  type: 'number',
                },
              }
            }
          }
        }
      },
      response: {
        201: {
          description: 'Historic created',
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
    handler: addHistoricHandler,
  })

  // update a historic
  app.route<IUpdateHistoricRequest>({
    url: '/:id',
    method: ['PUT'],
    schema: {
      summary: 'Update a historic',
      description: 'Update a historic',
      tags: ['Histories'],
      body: {
        type: 'object',
        description: 'Update a historic',
        properties: {
          licensePlate: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          coords: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'number',
                },
                longitude: {
                  type: 'number',
                },
                timestamp: {
                  type: 'number',
                },
              }
            }
          }
        }
      },
      response: {
        204: {
          description: 'Historic updated',
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
    handler: updateHistoricHandler,
  })

  // delete a historic
  app.route<IDeleteHistoricRequest>({
    url: '/:id',
    method: ['DELETE'],
    schema: {
      summary: 'Delete a historic',
      description: 'Delete a historic',
      tags: ['Histories'],
      response: {
        204: {
          description: 'Historic deleted',
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
    handler: deleteHistoricHandler,
  })

  // update a historic
  app.route<IUpdateHistoricRequest>({
    url: '/check-out',
    method: ['POST'],
    schema: {
      summary: 'Create a checkout',
      description: 'Create a checkout',
      tags: ['Histories'],
      body: {
        type: 'object',
        description: 'Create a checkout',
        properties: {
          id: {
            type: 'string'
          },
          coords: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                latitude: {
                  type: 'number',
                },
                longitude: {
                  type: 'number',
                },
                timestamp: {
                  type: 'number',
                },
              }
            }
          }
        }
      },
      response: {
        204: {
          description: 'Checkout created',
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
    handler: checkOutHistoricHandler,
  })

  app.route<IGetHistoricRequest>({
    url: '/get-car-in-use',
    method: ['GET'],
    schema: {
      summary: 'Returns a Historic in use',
      description: 'Return a historic\'s data in use',
      tags: ['Histories'],
      response: {
        200: {
          description: 'Returns a Historic in use',
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            licensePlate: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            status: {
              type: 'string'
            },
            createdAt: {
              type: 'string'
            },
            updatedAt: {
              type: 'string'
            },
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
    handler: getCarInUseHandler,
  })
};
