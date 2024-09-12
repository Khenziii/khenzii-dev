import { type TRPCContext } from "@khenzii-dev/server/api/trpc";

export abstract class BaseService {
    ctx: TRPCContext;
    input?: Record<string, unknown>;

    constructor(ctx: TRPCContext, input?: Record<string, unknown>) {
        this.ctx = ctx;
        this.input = input;
    }
}
