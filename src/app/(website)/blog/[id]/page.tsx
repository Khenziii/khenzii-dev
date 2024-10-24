"use client";

import {
    useContext,
    useEffect,
    type FC,
} from "react";
import { api, IsNotFoundContext } from "@khenzii-dev/providers";
import { Loading, Paragraph, Button, Icon, Anchor, Header, Flex } from "@khenzii-dev/ui/atoms";

type BlogPostProps = {
    params: { id: string };
};

const BlogPost: FC<BlogPostProps> = ({ params }) => {
    const { setIsNotFound } = useContext(IsNotFoundContext);
    
    const {
        data: postData,
        isLoading: postIsLoading,
        isError: postError,
    } = api.blog.blogPost.getPost.useQuery({
        id: params.id,
    });

    useEffect(() => {
        if (postIsLoading) return;

        if (postError || postData === null || postData === undefined) {
            setIsNotFound(true);
            return;
        }

        return () => setIsNotFound(false);
    }, [
        postIsLoading,
        postError,
        postData,
        setIsNotFound,
    ]);
    
    if (postIsLoading) return (
        <Loading size={200} />
    );

    if (postError) return (
        <Flex
            direction={"column"}
            align={"center"}
            styles={{ paddingInline: "10px" }}
        >
            <Header>Error!</Header>
            <Paragraph
                fontSize={1.5}
                styles={{ textAlign: "center" }}
            >
                {"Something went wrong while trying to fetch the post!"}
            </Paragraph>

            <Anchor href={"/"} prefetch>
                <Button style={{ width: "fit-content", padding: "10px" }}>
                    <Icon iconName={"house"} size={2.5} />
                </Button>
            </Anchor>
        </Flex>
    );

    if (postData === null || postData === undefined) return (
        <Paragraph fontSize={1.5} styles={{ textAlign: "center" }}>
            {"This route doesn't exist."}
        </Paragraph>
    );

    return (
        <>
            <Anchor href={"/blog"} prefetch>
                <Button style={{ width: "fit-content", padding: "10px" }}>
                    <Icon iconName={"house"} size={2.5} />
                </Button>
            </Anchor>
        </>
    );
};

export default BlogPost;

