import {
    createTRPCRouter,
    publicProcedure,
} from "@khenzii-dev/server/api/trpc";


export const blogTagRouter = createTRPCRouter({
    getTags: publicProcedure.query(async (): Promise<unknown> => {
        return "Hello from the tagRouter!";
    }),
});
