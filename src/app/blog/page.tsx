import { Paragraph, Loading } from "@khenzii-dev/ui/atoms";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog",
};

const Blog = () => (
	<>
    	<Paragraph fontSize={1.5} styles={{ textAlign: "center" }}>
        	This page is not yet available!
    	</Paragraph>
		
		<Loading size={100} />
	</>
);

export default Blog;
