import { type TRPCContext } from "@khenzii-dev/server/api/trpc";

export abstract class BaseService {
    ctx: TRPCContext;
    input?: Record<string, string | boolean | number>;

    constructor(ctx: TRPCContext, input?: Record<string, string | boolean | number>) {
        this.ctx = ctx;
        this.input = input;
    }
}
