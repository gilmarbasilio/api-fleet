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
