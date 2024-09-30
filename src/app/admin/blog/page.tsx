"use client";

import {
    useCallback,
    useState,
    useRef,
    useEffect,
    type FormEventHandler,
    type KeyboardEventHandler,
} from "react";
import clsx from "clsx";
import { api } from "@khenzii-dev/providers";
import {
    Flex,
    Header,
    Paragraph,
    Button,
    Icon,
    Dialog,
    Input,
    Loading,
    CodeBlock,
} from "@khenzii-dev/ui/atoms";
import { MarkdownRenderer } from "@khenzii-dev/ui/molecules";
import { Tags, type UITag } from "@khenzii-dev/ui/organisms";
import { type BlogPost } from "@khenzii-dev/server/backend";
import {
    filterTagsByIds,
    blogTagToUiTag,
    uiTagToBlogTag,
} from "@khenzii-dev/utils";
import style from "@khenzii-dev/styles/admin_blog.module.scss";

enum dialogTitleEnum {
    NEW_POST = "New Post",
    UPDATE_POST= "Update Post",
    NEW_TAG = "New Tag",
    UPDATE_TAG = "Update Tag",
}

enum dialogVariantEnum {
    POST = "post",
    TAG = "tag",
}

const AdminBlog = () => {
    const [dialogTitle, setDialogTitle] = useState(dialogTitleEnum.NEW_POST);
    const [dialogVariant, setDialogVariant] = useState(dialogVariantEnum.POST);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentDatasId, setCurrentDatasId] = useState("");
    const [tags, setTags] = useState<UITag[]>([]);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [postsOffset, setPostsOffset] = useState(0);
    const [fetchedAllPosts, setFetchedAllPosts] = useState(false);
    const [showMarkdown, setShowMarkdown] = useState(false);
    const [blogPostTitle, setBlogPostTitle] = useState("");
    const [blogPostContent, setBlogPostContent] = useState("");

    const loadingRef = useRef(null);
    const postTitleInput = useRef<HTMLInputElement>(null);
    const postContentInput = useRef<HTMLInputElement>(null);
    const tagNameInput = useRef<HTMLInputElement>(null);

    const { refetch: blogPostsRefetch } = api.blog.blogPost.getPosts.useQuery(
        { offset: postsOffset },
        { enabled: false },
    );
    const {
        data: blogTagsData,
        isLoading: blogTagsAreLoading,
        refetch: blogTagsRefetch,
    } = api.blog.blogTag.getTags.useQuery();
    const { mutateAsync: deletePostMutation } = api.blog.blogPost.deletePost.useMutation();
    const { mutateAsync: createPostMutation } = api.blog.blogPost.createPost.useMutation();
    const { mutateAsync: updatePostMutation } = api.blog.blogPost.updatePost.useMutation();
    const { mutateAsync: deleteTagMutation } = api.blog.blogTag.deleteTag.useMutation();
    const { mutateAsync: createTagMutation } = api.blog.blogTag.createTag.useMutation();
    const { mutateAsync: updateTagMutation } = api.blog.blogTag.updateTag.useMutation();

    const blogPostsManualRefetch = useCallback(async () => {
        setPosts([]);
        setPostsOffset(0);
        setFetchedAllPosts(false);
    }, []);

    const deletePost = useCallback(async ({ id }: {
        id: string;
    }) => {
        await deletePostMutation({ id });

        await blogPostsManualRefetch();
    }, [deletePostMutation, blogPostsManualRefetch]);

    const createPost = useCallback(async ({ title, content, tagIDs }: {
        title: string;
        content: string;
        tagIDs: string[];
    }) => {
        await createPostMutation({
            title,
            content,
            tagIDs,
            created_at: new Date().toString(),
        });

        await blogPostsManualRefetch();
    }, [createPostMutation, blogPostsManualRefetch]);

    const updatePost = useCallback(async ({ id, updatedPost }: {
        id: string;
        updatedPost: {
            title: string;
            content: string;
            tagIDs: string[];
        };
    }) => {
        await updatePostMutation({
            id,
            updatedPost,
        });

        await blogPostsManualRefetch();
    }, [updatePostMutation, blogPostsManualRefetch]);

    const deleteTag = useCallback(async ({ id }: {
        id: string;
    }) => {
        await deleteTagMutation({ id });

        await blogTagsRefetch();
    }, [deleteTagMutation, blogTagsRefetch]);

    const createTag = useCallback(async ({ name }: {
        name: string;
    }) => {
        await createTagMutation({ name });

        await blogTagsRefetch();
    }, [createTagMutation, blogTagsRefetch]);

    const updateTag = useCallback(async ({ id, updatedTag }: {
        id: string;
        updatedTag: {
            name: string;
        };
    }) => {
        await updateTagMutation({
            id,
            updatedTag,
        });

        await blogTagsRefetch();
    }, [updateTagMutation, blogTagsRefetch]);

    const dialogOpen = useCallback((dialogTitle: dialogTitleEnum) => {
        setDialogTitle(dialogTitle);
        setIsDialogOpen(true);
    }, []);

    const handleNewPostSubmit = useCallback(async () => {
        if (!postTitleInput.current || !postContentInput.current) return;

        const title = postTitleInput.current.value;
        const content = postContentInput.current.value;
        const tagIDs = uiTagToBlogTag(tags, blogTagsData).map((tag) => tag.id);

        await createPost({ title, content, tagIDs });
    }, [tags, blogTagsData, createPost]);

    const handleUpdatePostSubmit = useCallback(async () => {
        if (!postTitleInput.current || !postContentInput.current) return;

        const title = postTitleInput.current.value;
        const content = postContentInput.current.value;
        const tagIDs = uiTagToBlogTag(tags, blogTagsData).map((tag) => tag.id);
        const id = currentDatasId;

        await updatePost({ id, updatedPost: { title, content, tagIDs } });
    }, [tags, blogTagsData, currentDatasId, updatePost]);

    const handleNewTagSubmit = useCallback(async () => {
        if (!tagNameInput.current) return;

        const name = tagNameInput.current.value;

        await createTag({ name });
    }, [createTag]);

    const handleUpdateTagSubmit = useCallback(async () => {
        if (!tagNameInput.current) return;
    
        const name = tagNameInput.current.value;
        const id = currentDatasId;

        await updateTag({ id, updatedTag: { name } });
    }, [currentDatasId, updateTag]);

    const onDialogClose = useCallback(async (confirmed: boolean) => {
        setIsDialogOpen(false);
        if (!confirmed) return;

        switch (dialogTitle) {
            case dialogTitleEnum.NEW_POST:
                await handleNewPostSubmit();
                break;
                
            case dialogTitleEnum.UPDATE_POST:
                await handleUpdatePostSubmit();
                break;

            case dialogTitleEnum.NEW_TAG:
                await handleNewTagSubmit();
                break;

            case dialogTitleEnum.UPDATE_TAG:
                await handleUpdateTagSubmit();
                break;
        }
    }, [
        dialogTitle,
        handleNewPostSubmit,
        handleUpdatePostSubmit,
        handleNewTagSubmit,
        handleUpdateTagSubmit,
    ]);

    // eslint-disable-next-line
    const handleDialogFormSubmit: FormEventHandler = useCallback(async (event) => {
        // don't refresh the page
        event.preventDefault();

        await onDialogClose(true);
    }, [onDialogClose]);

    const handleKeyDownPostTitleInput: KeyboardEventHandler = useCallback((event) => {
        if (!postContentInput.current) return;

        const keys: string[] = ["Enter", "ArrowDown"];
        if (keys.includes(event.key)) {
            // don't submit the form if clicked "Enter"
            event.preventDefault();

            postContentInput.current.focus();
        }
    }, []);

    const handleKeyDownPostContentInput: KeyboardEventHandler = useCallback((event) => {
        if (!postTitleInput.current) return;

        if (event.key == "ArrowUp") postTitleInput.current.focus();
    }, []);

    const fetchMorePosts = useCallback(async () => {
        if (fetchedAllPosts) return;

        const { data: newPosts } = await blogPostsRefetch();

        if (!newPosts) return;
        if (newPosts.length < 10) setFetchedAllPosts(true);
       
        setPosts((currentPosts) => [...currentPosts, ...newPosts]);
        setPostsOffset((currentOffset) => currentOffset + 1);
    }, [blogPostsRefetch, fetchedAllPosts]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return;
                if (!entry.isIntersecting) return;
    
                void fetchMorePosts();
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
        if (
            dialogTitle === dialogTitleEnum.UPDATE_POST
            || dialogTitle === dialogTitleEnum.NEW_POST
        ) {
            setDialogVariant(dialogVariantEnum.POST);
        } else {
            setDialogVariant(dialogVariantEnum.TAG);
        }
    }, [dialogTitle]);

    
    return (
        <Flex
            direction="column"
            align="center"
            styles={{ maxWidth: "95vw" }}
        >
            <Header>Blog</Header>

            <Paragraph fontSize={1.75}>Tags:</Paragraph>

            <Button id={"add-tag-button"} onClick={() => {
                if (tagNameInput.current === null) return;
                tagNameInput.current.value = "";

                dialogOpen(dialogTitleEnum.NEW_TAG);
            }}>
                <Icon iconName={"plus-lg"} size={1.5} />
            </Button>

            {(blogTagsAreLoading || blogTagsData === undefined)
                ? (
                    <Loading size={100} />
                )
                : blogTagsData.map((tag, index) => (
                    <Flex key={`tag-${index}`} id={`tag-${index}`}>
                        <Paragraph fontSize={1.5}>
                            <CodeBlock>
                                name: {tag.name} <br />
                            </CodeBlock>
                        </Paragraph>

                        <Button id={`update-tag-button-${index}`} onClick={() => {
                            if (tagNameInput.current === null) return;
                            tagNameInput.current.value = tag.name;

                            setCurrentDatasId(tag.id);
                            dialogOpen(dialogTitleEnum.UPDATE_TAG);
                        }}>
                            <Icon iconName={"pencil-fill"} size={1.5} />
                        </Button>

                        <Button
                            onClick={() => deleteTag({ id: tag.id })}
                            id={`delete-tag-button-${index}`}
                            color={"destructive"}
                        >
                            <Icon iconName={"trash"} size={1.5} />
                        </Button>
                    </Flex>
                ))
            }

            <Dialog
                title={dialogTitle}
                open={isDialogOpen}
                onClose={() => onDialogClose(false)}
            >
                <form onSubmit={handleDialogFormSubmit} className={style.form} id={"dialog"}>
                    <Flex direction={"column"} gap={10}>
                        <Flex
                            direction={"row"}
                            gap={10}
                            styles={dialogVariant === dialogVariantEnum.TAG ? { display: "none" } : {}}
                            fullWidth
                        >
                            <div onClick={() => setShowMarkdown(false)}>
                                <Paragraph
                                    className={clsx([style.selectParagraph, {
                                        [style.active as string]: !showMarkdown,
                                    }])}
                                    fontSize={1.5}
                                >
                                    Edit    
                                </Paragraph>
                            </div>

                            <hr className={style.line} />

                            <div onClick={() => {
                                if (!postTitleInput.current || !postContentInput.current) return;

                                const title = postTitleInput.current.value;
                                const content = postContentInput.current.value;
                                
                                setBlogPostTitle(title);
                                setBlogPostContent(content);
                                setShowMarkdown(true);
                            }}>
                                <Paragraph
                                    className={clsx([style.selectParagraph, {
                                        [style.active as string]: showMarkdown,
                                    }])}
                                    fontSize={1.5}
                                >
                                    Markdown
                                </Paragraph>
                            </div>
                        </Flex>
                        
                        <div style={(dialogVariant === dialogVariantEnum.TAG || showMarkdown) ? { display: "none" } : {}}>
                            <Tags
                                tags={tags}
                                onClick={(updatedTags) => setTags(updatedTags)}
                                size={1.5}
                            />
                        </div>

                        <div style={(dialogVariant === dialogVariantEnum.TAG || !showMarkdown) ? { display: "none" } : {}}>
                            <Paragraph fontSize={2}>{blogPostTitle}</Paragraph>
    
                            <MarkdownRenderer>{blogPostContent}</MarkdownRenderer>
                        </div>

                        <Input
                            placeholder={"Post's Title.."}
                            id={"post-input-title"}
                            onKeyDown={handleKeyDownPostTitleInput}
                            ref={postTitleInput}
                            styles={(dialogVariant === dialogVariantEnum.TAG || showMarkdown) ? { display: "none" } : {}}
                        />

                        <Input
                            placeholder={"Post's Content.."}
                            id={"post-input-content"}
                            onKeyDown={handleKeyDownPostContentInput}
                            ref={postContentInput}
                            styles={(dialogVariant === dialogVariantEnum.TAG || showMarkdown) ? { display: "none" } : {}}
                        />

                        <Input  
                            placeholder={"Tag's Name.."}
                            id={"tag-input-name"}
                            ref={tagNameInput}
                            styles={dialogVariant === dialogVariantEnum.POST ? { display: "none" } : {}}
                        />
                    </Flex>

                    <Button onClick={handleDialogFormSubmit} id={"dialog-submit-button"}>
                        <Icon iconName={"check"} size={1.5} />
                    </Button>
                </form>
            </Dialog>

            <Paragraph fontSize={1.75}>Posts:</Paragraph>

            <Button id={"add-post-button"} onClick={() => {
                if (
                    postTitleInput.current === null
                    || postContentInput.current === null
                ) return;

                postTitleInput.current.value = "";
                postContentInput.current.value = "";
                setTags(blogTagToUiTag([], blogTagsData));
                setShowMarkdown(false);

                dialogOpen(dialogTitleEnum.NEW_POST);
            }}>
                <Icon iconName={"plus-lg"} size={1.5} />
            </Button>

            {posts.map((post, index) => (
                <Flex key={`post-${index}`} id={`post-${index}`}>
                    <Paragraph fontSize={1.5}>
                        <CodeBlock>
                            title: {post.title} <br />
                            content: {post.content} <br />
                            created_at: {post.created_at.toString()} <br />
                            tags: {
                                filterTagsByIds(post.tagIDs, blogTagsData)
                                    .map((tag) => tag.name)
                                    .join(", ")
                            } <br />
                        </CodeBlock>
                    </Paragraph>

                    <Button id={`update-post-button-${index}`} onClick={() => {
                        if (
                            postTitleInput.current === null
                            || postContentInput.current === null
                        ) return;
                        
                        postTitleInput.current.value = post.title;
                        postContentInput.current.value = post.content;
                        setTags(blogTagToUiTag(post.tagIDs, blogTagsData));
                        setShowMarkdown(false);

                        setCurrentDatasId(post.id);
                        dialogOpen(dialogTitleEnum.UPDATE_POST);
                    }}>
                        <Icon iconName={"pencil-fill"} size={1.5} />
                    </Button>

                    <Button
                        id={`delete-post-button-${index}`}
                        onClick={() => deletePost({ id: post.id })}
                        color={"destructive"}
                    >
                        <Icon iconName={"trash"} size={1.5} />
                    </Button>
                </Flex>
            ))}

            {!fetchedAllPosts && (
                <div ref={loadingRef}>
                    <Loading size={100} />
                </div>
            )}
        </Flex>
    );
};

export default AdminBlog;
