import { type TRPCContext } from "@khenzii-dev/server/api/trpc";

export abstract class BaseService {
    ctx: TRPCContext;

    constructor(ctx: TRPCContext) {
        this.ctx = ctx;
    }
}
