export * from "./event";

import { BaseService } from "@khenzii-dev/server/backend";
import type { JsonValue } from "@prisma/client/runtime/library";
import { z } from "zod";

export const getEventsInput = z.object({
    offset: z.number().min(0).optional(),
}).optional();

type getEventsInputType = z.infer<typeof getEventsInput>;

export type AdminEvent = {
    id: string;
    title: string;
    json: JsonValue;
    created_at: Date;
};

export class EventLogService extends BaseService {
    async getEvents(input: getEventsInputType): Promise<AdminEvent[]> {
        return await this.ctx.db.event.findMany({
            orderBy: { created_at: "desc" },
            skip: (input?.offset ?? 0) * 20,
            take: 20,
        });
    }
}

