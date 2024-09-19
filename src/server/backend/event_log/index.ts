import { db } from "@khenzii-dev/server/db";

export class Event {
    message: string;
    createdAt: Date;

    constructor(message: string) {
        this.message = message;
        this.createdAt = new Date();
    }

    async create() {
        await db.event.create({ data: {
            message: this.message,
            created_at: this.createdAt,
        } });
    }
}

