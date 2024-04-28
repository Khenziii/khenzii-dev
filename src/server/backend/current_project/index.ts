import { BaseService } from "@khenzii-dev/server/backend";

export type currentProject = {
    name: string;
    description: string;
};

export class CurrentProjectService extends BaseService {
    async getCurrentProject(): Promise<currentProject> {
        const latestProject = await this.ctx.db.currentProject.findMany({
            orderBy: {
                id: "desc",
            },
            take: 1,
        });
        const { name, description } = latestProject[0] ?? { name: "...", description: "..." };

        return { name, description };
    }
}
