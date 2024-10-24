"use client";

import {
    useState,
    useEffect,
    useCallback,
    useRef,
} from "react";
import { type BlogPost } from "@khenzii-dev/server/backend";
import {
    Flex,
    Loading,
    Paragraph,
} from "@khenzii-dev/ui/atoms";
import { api } from "@khenzii-dev/providers";

// export type PostsProps = {};

export const Posts = () => {
    const loadingRef = useRef(null);
    const [postsOffset, setPostsOffset] = useState(-1);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [fetchedAllPosts, setFetchedAllPosts] = useState(false);
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
        >
            {posts.map((post, index) => (
                <Paragraph key={index}>{post.title}</Paragraph>
            ))}
                        
            {!fetchedAllPosts && (
                <div ref={loadingRef}>
                    <Loading size={100} />
                </div>
            )}
        </Flex>
    );
};
