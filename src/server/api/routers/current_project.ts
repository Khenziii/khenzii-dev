import {
    createTRPCRouter,
    publicProcedure,
} from "@khenzii-dev/server/api/trpc";


export type currentProject = {
    name: string;
    description: string;
};

export const currentProjectRouter = createTRPCRouter({
    getProject: publicProcedure.query((): currentProject => {
        // TODO: fetch this from the database
        return {
            name: "khenzii-dev",
            description: "The very website that you're using right now!",
        };
    }),
});
