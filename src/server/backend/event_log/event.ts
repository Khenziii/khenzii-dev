import { db } from "@khenzii-dev/server/db";

export class Event {
    private title: string | undefined;
    private json: object | undefined;
    private createdAt: Date;

    constructor() {
        this.createdAt = new Date();
    }

    setTitle(title: string) {
        this.title = title;
        return this;
    }

    setJson(json: object) {
        this.json = json;
        return this;
    }
    
    async create() {
        if (this.title === undefined) {
            throw new Error("`Event` builder is missing the `title` field.");
        }

        if (this.json === undefined) {
            throw new Error("`Event` builder is missing the `json` field.");
        }

        await db.event.create({ data: {
            title: this.title,
            json: this.json,
            created_at: this.createdAt,
        } });
    }
}

