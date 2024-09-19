import { db } from "@khenzii-dev/server/db";

export class Event {
    private title: string | undefined;
    private message: string | undefined;
    private createdAt: Date;

    constructor() {
        this.createdAt = new Date();
    }

    setTitle(title: string) {
        this.title = title;
        return this;
    }

    setMessage(message: string) {
        this.message = message;
        return this;
    }
    
    async create() {
        if (this.title === undefined) {
            throw new Error("`Event` factory is missing the `title` field.");
        }

        if (this.message === undefined) {
            throw new Error("`Event` factory is missing the `message` field.");
        }

        await db.event.create({ data: {
            title: this.title,
            message: this.message,
            created_at: this.createdAt,
        } });
    }
}

