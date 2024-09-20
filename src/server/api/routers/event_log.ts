import {
    createTRPCRouter,
    publicProcedure,
} from "@khenzii-dev/server/api/trpc";
import { getEventsInput, EventLogService } from "@khenzii-dev/server/backend";


export const eventLogRouter = createTRPCRouter({
    getEvents: publicProcedure
        .input(getEventsInput)
        .query(async ({ ctx, input }) => {
            const handler = new EventLogService(ctx);
            return await handler.getEvents(input);
        }),
});
