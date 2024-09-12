import { BaseService } from "@khenzii-dev/server/backend";
import { z } from "zod";

export const setCurrentProjectInput = z.object({
    projectId: z.string(),
});

export const deleteProjectInput = z.object({
    projectId: z.string(),
});

export const addProjectInput = z.object({
    name: z.string(),
    description: z.string(),
});

type setCurrentProjectInputType = z.infer<typeof setCurrentProjectInput>;
type deleteProjectInputType = z.infer<typeof deleteProjectInput>;
type addProjectInputType = z.infer<typeof addProjectInput>;

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
    
    async setCurrentProject(input: setCurrentProjectInputType) {
        await this.ctx.db.currentProject.updateMany({
            where: {},
            data: {
                current: false,
            },
        });
        await this.ctx.db.currentProject.update({
            where: {
                id: input.projectId,
            },
            data: {
                current: true,
            },
        });
    }

    async deleteProject(input: deleteProjectInputType) {
        await this.ctx.db.currentProject.delete({
            where: {
                id: input.projectId,
            },
        });
    }

    async addProject(input: addProjectInputType) {
        await this.ctx.db.currentProject.create({
            data: {
                name: input.name,
                description: input.description,
                current: false,
            },
        });
    }
}
