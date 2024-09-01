import { BaseService } from "@khenzii-dev/server/backend";

export type CurrentProject = {
    name: string;
    description: string;
    id: string;
};

export class CurrentProjectService extends BaseService {
    async getCurrentProject(): Promise<CurrentProject> {
        const currentProject = await this.ctx.db.currentProject.findFirst({
            where: {
                current: true,
            },
        });
        const { name, description, id } = currentProject ?? { name: "...", description: "...", id: "..." };

        return { name, description, id };
    }

    async getOldProjects(): Promise<CurrentProject[]> {
        const oldProjects = await this.ctx.db.currentProject.findMany({
            where: {
                current: false,
            },
        });

        return oldProjects;
    }
    
    async setCurrentProject() {
        if (!this.input) return;
        if (typeof this.input.projectId !== "string") return;

        await this.ctx.db.currentProject.updateMany({
            where: {},
            data: {
                current: false,
            },
        });
        await this.ctx.db.currentProject.update({
            where: {
                id: this.input.projectId,
            },
            data: {
                current: true,
            },
        });
    }

    async deleteProject() {
        if (!this.input) return;
        if (typeof this.input.projectId !== "string") return;
        
        await this.ctx.db.currentProject.delete({
            where: {
                id: this.input.projectId,
            },
        });
    }
}
