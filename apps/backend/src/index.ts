import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import dotenv from "dotenv";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { protectedProcedure, publicProcedure, router } from "./trpc";
import { z } from "zod";
import { supabase } from "./db";
import { createContext } from "./context";

dotenv.config();

const fastify = Fastify({ logger: true });
const port = Number(process.env.PORT) || 3001;

fastify.register(cors, {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});

fastify.decorate("supabase", supabase);

interface AuthenticatedRequest extends FastifyRequest {
  user?: any;
}

fastify.decorate(
  "authenticate",
  async (request: AuthenticatedRequest, reply: FastifyReply) => {
    // ... (keep existing authentication logic)
  },
);

// Define tRPC router
const appRouter = router({
  getAssets: protectedProcedure
    .input(z.string())
    .query(async ({ input: userId }) => {
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .eq("owner", userId);

      if (error) throw error;
      return data;
    }),

  addAsset: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        ownerId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { data, error } = await supabase
        .from("assets")
        .insert({
          name: input.name,
          description: input.description,
          owner: input.ownerId,
        })
        .select();
      if (error) throw error;
      return data[0];
    }),

  transferAsset: protectedProcedure
    .input(
      z.object({
        assetId: z.string(),
        fromUserId: z.string(),
        toUserEmail: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure the user is authenticated
      if (!ctx.user) {
        throw new Error("Not authenticated");
      }

      // Verify that the fromUserId matches the authenticated user
      if (ctx.user.id !== input.fromUserId) {
        throw new Error("Not authorized to transfer this asset");
      }

      try {
        // Verify the asset belongs to the user
        const { data: assetData, error: assetError } = await supabase
          .from("assets")
          .select("owner")
          .eq("id", input.assetId)
          .single();

        if (assetError || !assetData) {
          throw new Error("Asset not found");
        }

        if (assetData.owner !== input.fromUserId) {
          throw new Error("Not authorized to transfer this asset");
        }

        // Call the custom function to get the recipient user ID
        const { data: toUserId, error: userError } = await supabase
          .rpc("get_user_id_by_email", {
            p_email: input.toUserEmail,
          })
          .single();

        if (userError || !toUserId) {
          throw new Error(`No user found with email: ${input.toUserEmail}`);
        }

        // Perform the transfer
        const { data, error } = await supabase.rpc("transfer_asset", {
          p_asset_id: input.assetId,
          p_from_user_id: input.fromUserId,
          p_to_user_id: toUserId,
        });

        if (error) throw error;
        return { message: "Asset transferred successfully" };
      } catch (error: any) {
        throw new Error(error.message || "Failed to transfer asset");
      }
    }),

  test: protectedProcedure.query(() => {
    return { message: "This is a test route" };
  }),
});

// Register tRPC plugin
fastify.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: { router: appRouter, createContext },
});

// Start the server
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

export type AppRouter = typeof appRouter;
