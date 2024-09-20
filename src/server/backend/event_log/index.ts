export * from "./event";

import { BaseService } from "..";

export class EventLogService extends BaseService {
    async getEvents() {
        return await this.ctx.db.event.findMany({
            orderBy: { created_at: "desc" },
        });
    }
}

