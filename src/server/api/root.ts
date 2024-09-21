import { createCallerFactory, createTRPCRouter } from "@khenzii-dev/server/api/trpc";
import {
    currentProjectRouter,
    blogRouter,
    eventLogRouter,
} from "@khenzii-dev/server/api/routers";

export const appRouter = createTRPCRouter({
    currentProject: currentProjectRouter,
    blog: blogRouter,
    eventLog: eventLogRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
