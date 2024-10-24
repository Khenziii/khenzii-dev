import type { Metadata } from "next";
import { Posts } from "@khenzii-dev/ui/organisms";

export const metadata: Metadata = {
    title: "Blog",
};

const Blog = () => (
    <Posts />
);

export default Blog;
