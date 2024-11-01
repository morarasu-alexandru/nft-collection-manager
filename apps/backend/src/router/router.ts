import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { AssetController } from "../controllers/assetController";

export const appRouter = router({
  getAssets: protectedProcedure
    .input(z.string())
    .query(({ input: userId }) => AssetController.getUserAssets(userId)),

  getAssetDetails: protectedProcedure
    .input(z.string())
    .query(({ input: assetId }) => AssetController.getAssetDetails(assetId)),

  addAsset: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        ownerId: z.string(),
      }),
    )
    .mutation(({ input }) => AssetController.createAsset(input)),

  transferAsset: protectedProcedure
    .input(
      z.object({
        assetId: z.string(),
        fromUserId: z.string(),
        toUserEmail: z.string().email(),
      }),
    )
    .mutation(({ ctx, input }) =>
      AssetController.transferAsset(input, ctx.user.id),
    ),

  test: protectedProcedure.query(() => {
    return { message: "This is a test route" };
  }),
});

export type AppRouter = typeof appRouter;
