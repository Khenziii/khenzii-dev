"use client";

import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import { blogTagToUiTag } from "@khenzii-dev/utils";
import { type BlogPost } from "@khenzii-dev/server/backend";
import {
    Flex,
    Anchor,
    Paragraph,
    Loading,
    Icon,
} from "@khenzii-dev/ui/atoms";
import { Tags } from "@khenzii-dev/ui/organisms";
import { api } from "@khenzii-dev/providers";
import { useMobile } from "@khenzii-dev/hooks";
import style from "./index.module.scss";

const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

// export type PostsProps = {};

export const Posts = () => {
    const mobile = useMobile();
    const loadingRef = useRef(null);
    const [postsOffset, setPostsOffset] = useState(-1);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [fetchedAllPosts, setFetchedAllPosts] = useState(false);
    const { data: tagsData } = api.blog.blogTag.getTags.useQuery();
    const { data: postsData } = api.blog.blogPost.getPosts.useQuery(
        { offset: postsOffset },
        {
            enabled: postsOffset >= 0,
            // avoids random refetches that cause issues.
            staleTime: Infinity,
        },
    );

    const fetchMorePosts = useCallback(() => {
        if (fetchedAllPosts) return;

        setPostsOffset((currentOffset) => currentOffset + 1);
    }, [fetchedAllPosts]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;
                if (!entry.isIntersecting) return;

                fetchMorePosts();
            },
            { threshold: 0.1 },
        );

        const ref = loadingRef.current;
        if (!ref) return;

        observer.observe(ref);
        return () => {
            observer.unobserve(ref);
        };
    }, [fetchMorePosts]);

    useEffect(() => {
        if (!postsData) return;
        if (postsData.length < 20) setFetchedAllPosts(true);

        setPosts((currentPosts) => [...currentPosts, ...postsData]);
    }, [postsData]);

    return (
        <Flex
            direction="column"
            align="center"
            className={style.container}
        >
            {posts.map((post, index) => (
                <Anchor
                    href={`/blog/${post.id}`}
                    key={`blog-post-${index}`}
                    className={style.post_container}
                    draggable={false}
                >
                    <Flex
                        direction={mobile ? "column" : "row"}
                        align={mobile ? undefined : "center"}
                        justify={"center"}
                    >
                        <Paragraph
                            fontSize={2}
                            styles={mobile
                                ? {}
                                : {
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                }
                            }
                        >
                            {post.title}
                        </Paragraph>
                        
                        <Flex styles={mobile ? {} : { marginLeft: "auto" }} align={"center"}>
                            <Icon iconName={"clock"} size={1.5} />
                            <Paragraph fontSize={1.5}>{formatDate(post.created_at)}</Paragraph>
                        </Flex>

                        <Tags
                            tags={blogTagToUiTag(post.tagIDs, tagsData)}
                            clickable={false}
                            size={1.5}
                            showOnlyActive
                        />
                    </Flex>
                </Anchor>
            ))}
                        
            {!fetchedAllPosts && (
                <div ref={loadingRef}>
                    <Loading size={100} />
                </div>
            )}
        </Flex>
    );
};
