import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context'; // You'll need to create this file

// Create a new tRPC instance
const t = initTRPC.context<Context>().create({
    errorFormatter({ shape }) {
        return shape;
    },
});

// Export the router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// Create a middleware for protected routes
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    return next({
        ctx: {
            // Infers that `user` is non-nullable
            user: ctx.user,
        },
    });
});

// Export a procedure that requires authentication
export const protectedProcedure = t.procedure.use(isAuthed);