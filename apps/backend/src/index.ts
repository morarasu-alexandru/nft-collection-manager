import Fastify from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { supabase } from "./db";
import { createContext } from "./context";
import { appRouter } from "./router/router";

dotenv.config();

const fastify = Fastify({ logger: true });
const port = Number(process.env.PORT) || 3001;

fastify.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

fastify.decorate("supabase", supabase);

fastify.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

const start = async () => {
  try {
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
