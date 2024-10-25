"use client";

import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import { blogTagToUiTag, uiTagToBlogTag } from "@khenzii-dev/utils";
import { type BlogPost } from "@khenzii-dev/server/backend";
import {
    Flex,
    Anchor,
    Paragraph,
    Loading,
    Icon,
    Header,
} from "@khenzii-dev/ui/atoms";
import { Tags, type UITag } from "@khenzii-dev/ui/organisms";
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
    const [tags, setTags] = useState<UITag[]>([]);
    const [fetchedAllPosts, setFetchedAllPosts] = useState(false);
    const { data: tagsData } = api.blog.blogTag.getTags.useQuery();
    const { data: postsData } = api.blog.blogPost.getPosts.useQuery(
        {
            offset: postsOffset,
            tags: uiTagToBlogTag(tags, tagsData)
                .map((tag) => ({ id: tag.id })),
        },
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

    useEffect(() => {
        if (!tagsData) return;

        setTags(blogTagToUiTag(tagsData.map((tag) => tag.id), tagsData));
    }, [tagsData]);

    return (
        <Flex
            direction="column"
            align="center"
            className={style.container}
            gap={20}
        >
            <Flex direction="column" align="flex-start" fullWidth>
                <Header>Filter</Header>
                <Paragraph fontSize={mobile ? 1.5 : 1.75}>Click the tags to filter posts!</Paragraph>
                <Paragraph fontSize={mobile ? 1.25 : 1.5}><i>* Any post with at least one of the selected tags will show up.</i></Paragraph>

                <Tags
                    tags={tags}
                    size={mobile ? 1.25 : 1.5}
                    onClick={(newTags) => {
                        setPosts([]);
                        setTags(newTags);
                    }}
                />
            </Flex>

            <Flex direction="column" fullWidth>
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
                                size={mobile ? 1.25 : 1.5}
                                showOnlyActive
                            />
                        </Flex>
                    </Anchor>
                ))}
            </Flex>
                        
            {!fetchedAllPosts && (
                <div ref={loadingRef}>
                    <Loading size={100} />
                </div>
            )}
        </Flex>
    );
};
