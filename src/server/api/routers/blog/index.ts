import { createTRPCRouter } from "@khenzii-dev/server/api/trpc";

import { blogTagRouter } from "./tag";
import { blogPostRouter } from "./post";

export const blogRouter = createTRPCRouter({
    blogTag: blogTagRouter,
    blogPost: blogPostRouter,
});

