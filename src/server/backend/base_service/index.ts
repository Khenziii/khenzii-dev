import { type TRPCContext } from "@khenzii-dev/server/api/trpc";

export abstract class BaseService {
    ctx: TRPCContext;
    input?: unknown;

    constructor(ctx: TRPCContext, input?: unknown) {
        this.ctx = ctx;
        this.input = input;
    }
}
