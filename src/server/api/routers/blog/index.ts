import { createTRPCRouter } from "@khenzii-dev/server/api/trpc";

import { blogTagRouter } from "./tag";

export const blogRouter = createTRPCRouter({
    blogTag: blogTagRouter,
});

