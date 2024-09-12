import { getServerAuthSession } from "@khenzii-dev/server/auth";
import { db } from "@khenzii-dev/server/db";
import { env } from "@khenzii-dev/env";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { type PrismaClient } from "@prisma/client";
import { type Session } from "next-auth";

// Context is available for every request handler.
export type TRPCContext = {
    db: PrismaClient;
    session: Session | null;
    headers: Headers;
};

// https://trpc.io/docs/server/context
export const createTRPCContext = async (opts: { headers: Headers }): Promise<TRPCContext> => {
    const session = await getServerAuthSession();

    return {
        db,
        session,
        ...opts,
    };
};

const t = initTRPC.context<TRPCContext>().create({
    transformer: superjson,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

// https://trpc.io/docs/server/server-side-calls
export const createCallerFactory = t.createCallerFactory;

// https://trpc.io/docs/router
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

// guarantees that `ctx.session.user` is not null
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    // if testing, skip authentication
    if (env.NODE_ENV === "test") return next();   

    if (!ctx.session?.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});
