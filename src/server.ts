import "dotenv/config";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.routes";
import { historicRoutes } from "./routes/historic.routes";

const app = fastify();

app.register(fastifyJwt, {
  secret: String(process.env.SECRET),
});

app.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }
);

app.register(require('@fastify/swagger'), {
  routePrefix: '/docs',
  swagger: {
    info: {
      title: 'Api Fleet Documentation',
      description: 'Api Fleet Documentation description',
      version: '0.0.1',
    },
    host: `${process.env.HOST || "localhost"}:${process.env.PORT || 3333}`,
    basePath: '/api/v1',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      bearerAuth: {
        type: 'apiKey',
        scheme: 'bearer',
        name: "Authorization",
        bearerFormat: 'JWT',
        in: 'Header',
        description: 'Token de autorização a api, exemplo: "Bearer TOKEN"',
      },
    },
  },
});

app.register(require('@fastify/swagger-ui'), {
  routePrefix: '/docs',
});

app.register(userRoutes, { prefix: "/api/v1/users" });
app.register(authRoutes, { prefix: "/api/v1/auth" });
app.register(historicRoutes, { prefix: "/api/v1/histories" });


app
  .listen({
    host: process.env.HOST || "localhost",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log("Http server running on port " + process.env.PORT || 3333);
  });

app.ready(err => {
  app.swagger();
})