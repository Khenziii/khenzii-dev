import { type FC } from "react";
import { Paragraph } from "@khenzii-dev/ui/atoms";

type BlogPostProps = {
    params: { id: string };
};

const BlogPost: FC<BlogPostProps> = ({ params }) => (
    <Paragraph fontSize={1.5} styles={{ textAlign: "center" }}>
        {params.id}
    </Paragraph>
);

export default BlogPost;

