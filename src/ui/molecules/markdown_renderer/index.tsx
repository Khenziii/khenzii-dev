import { type FC, type ReactNode } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
    Paragraph,
    Header,
    Anchor,
    Flex,
    PrimitiveListItem,
} from "@khenzii-dev/ui/atoms";
import styles from "./index.module.scss";

type MultimediaProps = {
    children: ReactNode;
    additionalText?: string;
    sizeMultiplier?: number;
};

export const Multimedia: FC<MultimediaProps> = ({ children, additionalText, sizeMultiplier = 1 }) => (
    <Flex direction={"column"} align={"center"} className={styles["multimedia-container"]} gap={10}>
        {children}

        {additionalText && (
            <Paragraph
                fontSize={1 * sizeMultiplier}
                styles={{ fontWeight: 500, fontStyle: "italic", textAlign: "center" }}
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

export const MarkdownRenderer: FC<MarkdownRendererProps> = ({ children, sizeMultiplier = 1 }) => (
    <Markdown
        rehypePlugins={[rehypeRaw]}
        components={{
            h1: ({ children }) => <Header fontSize={1.75 * sizeMultiplier}>{children}</Header>,
            h2: ({ children }) => <Header variant={"secondary"} fontSize={1.5 * sizeMultiplier}>{children}</Header>,
            h3: ({ children }) => <Header variant={"secondary"} fontSize={1.25 * sizeMultiplier}>{children}</Header>,
            p: ({ children }) => <Paragraph fontSize={1.25 * sizeMultiplier} styles={{ fontWeight: 500 }}>{children}</Paragraph>,
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
            a: ({ children, href }) => <Anchor href={href ?? ""} darkenOnHover newTab>{children}</Anchor>,
            ul: ({ children }) => <ul style={{ paddingLeft: 0 }}>{children}</ul>,
            li: ({ children, node }) => (
                <PrimitiveListItem
                    level={node?.position?.start.column}
                    styles={{ fontSize: `${1.25 * sizeMultiplier}rem`, fontWeight: 500 }}
                >
                    {children}
                </PrimitiveListItem>
            ),
        }}
    >
        {children}
    </Markdown>
);
