import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@khenzii-dev/server/api/trpc";
import {
    CurrentProjectService,
    type CurrentProject,
} from "@khenzii-dev/server/backend";
import { z } from "zod";


export const currentProjectRouter = createTRPCRouter({
    getProject: publicProcedure.query(async ({ ctx }): Promise<CurrentProject> => {
        const handler = new CurrentProjectService(ctx);
        return await handler.getCurrentProject();
    }),
    getOldProjects: protectedProcedure.query(async ({ ctx }): Promise<CurrentProject[]> => {
        const handler = new CurrentProjectService(ctx);
        return await handler.getOldProjects();
    }),
    setCurrentProject: protectedProcedure
        .input(z.object({
            projectId: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const handler =  new CurrentProjectService(ctx, input);
            return await handler.setCurrentProject();
        }),
});
