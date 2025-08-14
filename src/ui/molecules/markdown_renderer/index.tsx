import { type ReactElement, type FC, type ReactNode, type CSSProperties, useMemo } from "react";
import Markdown, { type Options as MarkdownOptions } from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
    Paragraph,
    Header,
    Anchor,
    Flex,
    PrimitiveListItem,
} from "@khenzii-dev/ui/atoms";
import styles from "./index.module.scss";

const getCommonTextStyles = (sizeMultiplier: number): CSSProperties => ({
    fontSize: `${1.25 * sizeMultiplier}rem`,
});

type MultimediaProps = {
    children: ReactNode;
    additionalText?: string;
    sizeMultiplier?: number;
};

const Multimedia: FC<MultimediaProps> = ({ children, additionalText, sizeMultiplier = 1 }) => (
    <Flex direction={"column"} align={"center"} className={styles["multimedia-container"]} gap={10}>
        {children}

        {additionalText && (
            <Paragraph
                fontSize={1 * sizeMultiplier}
                styles={{ fontStyle: "italic", textAlign: "center", fontWeight: 500 }}
            >
                {additionalText}
            </Paragraph>
        )}
    </Flex>

);

export type MarkdownRendererProps = {
    children: string;
    sizeMultiplier?: number;
};

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ children, sizeMultiplier = 1 }) => {
    const components = useMemo<MarkdownOptions["components"]>(() => ({
        h1: ({ children }) => <Header fontSize={1.75 * sizeMultiplier}>{children}</Header>,
        h2: ({ children }) => <Header variant={"secondary"} fontSize={1.5 * sizeMultiplier}>{children}</Header>,
        h3: ({ children }) => <Header variant={"secondary"} fontSize={1.25 * sizeMultiplier}>{children}</Header>,
        p: ({ children }) => {
            const isImage = typeof children !== "string" && typeof (children as unknown[])?.[0] !== "string";

            return isImage
                ? children as unknown as ReactElement
                : <Paragraph styles={{ ...getCommonTextStyles(sizeMultiplier), fontWeight: 500 }}>{children}</Paragraph>;
        },
        img: ({ src, alt }) => (
            <Multimedia additionalText={alt} sizeMultiplier={sizeMultiplier}>
                <img src={src} alt={alt} />
            </Multimedia>
        ),
        video: ({ src, children }) => (
            <Multimedia additionalText={children?.toString()} sizeMultiplier={sizeMultiplier}>
                <video controls>
                    <source src={src} />
                    {children?.toString()}
                </video>
            </Multimedia>
        ),
        a: ({ children, href }) => (
            <Anchor
                href={href ?? ""}
                styles={getCommonTextStyles(sizeMultiplier)}
                className={styles["common-text"]}
                darkenOnHover
                newTab
            >
                {children}
            </Anchor>
        ),
        ul: ({ children }) => <ul style={{ paddingLeft: 0 }}>{children}</ul>,
        li: ({ children, node }) => (
            <PrimitiveListItem
                level={node?.position?.start.column}
                styles={getCommonTextStyles(sizeMultiplier)}
                className={styles["common-text"]}
            >
                {children}
            </PrimitiveListItem>
        ),
        em: ({ children }) => (
            <em
                style={getCommonTextStyles(sizeMultiplier)}
                className={styles["common-text"]}
            >
                {children}
            </em>
        ),
        strong: ({ children }) => (
            <strong
                style={getCommonTextStyles(sizeMultiplier)}
                className={styles["common-text-strong"]}
            >
                {children}
            </strong>
        ),
    }), [sizeMultiplier]);

    return (
        <Markdown
            rehypePlugins={[rehypeRaw]}
            components={components}
        >
            {children}
        </Markdown>
    );
};
