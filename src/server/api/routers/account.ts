import {
    createTRPCRouter,
    publicProcedure,
} from "@khenzii-dev/server/api/trpc";
import { AccountService } from "@khenzii-dev/server/backend";
import { type User } from "@khenzii-dev/server/auth";
import { z } from "zod";


export const accountRouter = createTRPCRouter({
    login: publicProcedure
        .input(z.object({
            email: z.string(),
            password: z.string(),
        }))
        .query(async ({ ctx, input }): Promise<User | null> => {
            const handler = new AccountService(ctx, input);
            return await handler.login();
        }),
});
