"use client";

import {
    useContext,
    useEffect,
    type FC,
} from "react";
import { api, IsNotFoundContext } from "@khenzii-dev/providers";
import {
    Loading,
    Paragraph,
    Button,
    Icon,
    Anchor,
    Header,
    Flex,
} from "@khenzii-dev/ui/atoms";
import { MarkdownRenderer } from "@khenzii-dev/ui/molecules";
import { Tags } from "@khenzii-dev/ui/organisms";
import { blogTagToUiTag } from "@khenzii-dev/utils";
import { useMobile } from "@khenzii-dev/hooks";
import style from "@khenzii-dev/styles/blog_post.module.scss";

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} - ${hour}:${minute}`;
};

type BlogPostProps = {
    params: { id: string };
};

const BlogPost: FC<BlogPostProps> = ({ params }) => {
    const { setIsNotFound } = useContext(IsNotFoundContext);
    const mobile = useMobile();
    
    const {
        data: postData,
        isLoading: postIsLoading,
        isError: postError,
    } = api.blog.blogPost.getPost.useQuery({
        id: params.id,
    });
    const { data: tagsData } = api.blog.blogTag.getTags.useQuery();

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
        <Flex
            direction={"column"}
            className={style.post_container}
        >
            <Anchor href={"/blog"} styles={{ width: "fit-content" }} prefetch>
                <Button style={{ width: "fit-content", padding: "10px" }}>
                    <Icon iconName={"arrow-left-short"} size={mobile ? 1.75 : 2.5} />
                </Button>
            </Anchor>
            
            <Flex direction={mobile ? "column" : "row"}>
                <Paragraph
                    fontSize={mobile ? 2 : 3}
                    styles={{ lineBreak: "auto", hyphens: "auto" }}
                >
                    {postData.title}
                </Paragraph>

                <hr className={style.post_line} />

                <Flex align={"center"}>
                    <Icon iconName={"clock"} size={mobile ? 1.5 : 2} />
                    <Paragraph fontSize={mobile ? 1.5 : 2}>{formatDate(postData.created_at)}</Paragraph>
                </Flex>
            </Flex>

            <Tags
                tags={blogTagToUiTag(postData.tagIDs, tagsData)}
                size={mobile ? 1.5 : 2}
                clickable={false}
                showOnlyActive
            />

            <MarkdownRenderer>{postData.content}</MarkdownRenderer>
        </Flex>
    );
};

export default BlogPost;

