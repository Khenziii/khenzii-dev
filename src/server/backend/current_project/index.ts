import { BaseService } from "@khenzii-dev/server/backend";

export type currentProject = {
    name: string;
    description: string;
};

export class CurrentProjectService extends BaseService {
    getCurrentProject(): currentProject {
        // TODO: fetch this from the database
        return {
            name: "khenzii-dev",
            description: "the very website that you're using right now!",
        };
    }
}
