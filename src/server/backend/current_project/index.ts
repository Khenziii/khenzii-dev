import { BaseService } from "@khenzii-dev/server/backend";

export type CurrentProject = {
    name: string;
    description: string;
};

export class CurrentProjectService extends BaseService {
    async getCurrentProject(): Promise<CurrentProject> {
        const currentProject = await this.ctx.db.currentProject.findFirst({
            where: {
                current: true,
            },
        });
        const { name, description } = currentProject ?? { name: "...", description: "..." };

        return { name, description };
    }

    async getOldProjects(): Promise<CurrentProject[]> {
        const oldProjects = await this.ctx.db.currentProject.findMany({
            where: {
                current: false,
            },
        });

        return oldProjects;
    }
}
