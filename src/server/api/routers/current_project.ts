import {
    createTRPCRouter,
    publicProcedure,
} from "@khenzii-dev/server/api/trpc";
import {
    CurrentProjectService,
    type currentProject,
} from "@khenzii-dev/server/backend";


export const currentProjectRouter = createTRPCRouter({
    getProject: publicProcedure.query(({ ctx }): currentProject => {
        const handler = new CurrentProjectService(ctx);
        return handler.getCurrentProject();
    }),
});
