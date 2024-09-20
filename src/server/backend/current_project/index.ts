import { BaseService, Event } from "@khenzii-dev/server/backend";
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
        const newCurrentProject = await this.ctx.db.currentProject.findUnique({
            where: { id: input.projectId },
        });
        if (!newCurrentProject) return;

        const event = new Event()
            .setTitle("Updated the current project")
            .setJson(newCurrentProject);
        await event.create();

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
        const deletedProject = await this.ctx.db.currentProject.findUnique({
            where: { id: input.projectId },
        });
        if (!deletedProject) return;

        const event = new Event()
            .setTitle("Deleted a project")
            .setJson(deletedProject);
        await event.create();

        await this.ctx.db.currentProject.delete({
            where: {
                id: input.projectId,
            },
        });
    }

    async addProject(input: addProjectInputType) {
        const event = new Event()
            .setTitle("Created a new project")
            .setJson({ newProject: input });
        await event.create();

        await this.ctx.db.currentProject.create({
            data: {
                name: input.name,
                description: input.description,
                current: false,
            },
        });
    }
}
