import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "@khenzii-dev/server/api/trpc";
import {
    CurrentProjectService,
    setCurrentProjectInput,
    deleteProjectInput,
    addProjectInput,
} from "@khenzii-dev/server/backend";


export const currentProjectRouter = createTRPCRouter({
    getProject: publicProcedure.query(async ({ ctx }) => {
        const handler = new CurrentProjectService(ctx);
        return await handler.getCurrentProject();
    }),
    getOldProjects: protectedProcedure.query(async ({ ctx }) => {
        const handler = new CurrentProjectService(ctx);
        return await handler.getOldProjects();
    }),
    setCurrentProject: protectedProcedure
        .input(setCurrentProjectInput)
        .mutation(async ({ ctx, input }) => {
            const handler =  new CurrentProjectService(ctx);
            return await handler.setCurrentProject(input);
        }),
    deleteProject: protectedProcedure
        .input(deleteProjectInput)
        .mutation(async ({ ctx, input }) => {
            const handler =  new CurrentProjectService(ctx);
            return await handler.deleteProject(input);
        }),
    addProject: protectedProcedure
        .input(addProjectInput)
        .mutation(async ({ ctx, input }) => {
            const handler =  new CurrentProjectService(ctx);
            return await handler.addProject(input);
        }),
});
