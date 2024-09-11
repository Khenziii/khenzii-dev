import { createCallerFactory, createTRPCRouter } from "@khenzii-dev/server/api/trpc";
import {
    currentProjectRouter,
    blogRouter,
} from "@khenzii-dev/server/api/routers";

export const appRouter = createTRPCRouter({
    currentProject: currentProjectRouter,
    blog: blogRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
