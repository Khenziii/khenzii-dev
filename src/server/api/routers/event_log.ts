import {
    createTRPCRouter,
    publicProcedure,
} from "@khenzii-dev/server/api/trpc";
import { EventLogService } from "@khenzii-dev/server/backend";


export const eventLogRouter = createTRPCRouter({
    getEvents: publicProcedure.query(async ({ ctx }) => {
        const handler = new EventLogService(ctx);
        return await handler.getEvents();
    }),
});
