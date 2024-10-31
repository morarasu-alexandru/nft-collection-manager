// in context.ts
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { supabase } from "./db";

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (!error && user) {
      return { req, res, user };
    }
  }

  return { req, res, user: null };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
