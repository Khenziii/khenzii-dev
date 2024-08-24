import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@khenzii-dev/server/api/trpc";
import {
    CurrentProjectService,
    type CurrentProject,
} from "@khenzii-dev/server/backend";


export const currentProjectRouter = createTRPCRouter({
    getProject: publicProcedure.query(async ({ ctx }): Promise<CurrentProject> => {
        const handler = new CurrentProjectService(ctx);
        return await handler.getCurrentProject();
    }),
    getProjects: protectedProcedure.query(async ({ ctx }): Promise<CurrentProject[]> => {
        const handler = new CurrentProjectService(ctx);
        return await handler.getEveryProject();
    }),
});
