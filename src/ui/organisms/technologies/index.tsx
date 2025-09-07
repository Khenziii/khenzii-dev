"use client";

import Image from "next/image";
import type { FC, CSSProperties } from "react";
import { type IconsArrayProps, IconsArray } from "@khenzii-dev/ui/molecules";
import { type ParagraphProps, Paragraph, Tooltip, Anchor, Header } from "@khenzii-dev/ui/atoms";
import { useMobile } from "@khenzii-dev/hooks";

const programmingLanguageIconGenerator = (
    // Without extension, formatted like this: /programming-languages/{filename}.svg
    filename: string,
    languageName: string,
): FC => {
    const Icon: FC = () => (
        <Tooltip tooltip={<Paragraph>{languageName}</Paragraph>}>
            <Image
                alt={`${languageName} icon`}
                src={`/programming-languages/${filename}.svg`}
                width={200}
                height={200}
                style={{ maxWidth: "3rem", maxHeight: "3rem" }}
            />
        </Tooltip>
    );
    return Icon;
};

const PythonIcon = programmingLanguageIconGenerator("python", "Python");
const TypeScriptIcon = programmingLanguageIconGenerator("typescript", "TypeScript");
const ShellIcon = programmingLanguageIconGenerator("shell", "Shell");
const NixIcon = programmingLanguageIconGenerator("nix", "Nix");
const LuaIcon = programmingLanguageIconGenerator("lua", "Lua");
const RustIcon = programmingLanguageIconGenerator("rust", "Rust");
const GDScriptIcon = programmingLanguageIconGenerator("gdscript", "GDScript");
const CSharpIcon = programmingLanguageIconGenerator("csharp", "C#");
const CPPIcon = programmingLanguageIconGenerator("cpp", "C++");
const JavaIcon = programmingLanguageIconGenerator("java", "Java");
const KotlinIcon = programmingLanguageIconGenerator("kotlin", "Kotlin");
const FlutterIcon = programmingLanguageIconGenerator("flutter", "Flutter");
const SwiftIcon = programmingLanguageIconGenerator("swift", "Swift");

const proficientTechnologies: IconsArrayProps["icons"] = [TypeScriptIcon, PythonIcon, ShellIcon];
const otherTechnologies: IconsArrayProps["icons"] = [
    NixIcon,
    LuaIcon,
    RustIcon,
    GDScriptIcon,
    CSharpIcon,
    CPPIcon,
    JavaIcon,
    KotlinIcon,
    FlutterIcon,
    SwiftIcon,
];

// export type TechnologiesProps = {};

export const Technologies: FC = () => {
    const mobile = useMobile();
    const paragraphStyles: CSSProperties = { textAlign: mobile ? undefined : "center" };
    const paragraphProps: ParagraphProps = { styles: paragraphStyles, fontSize: 1.25 };

    return (
        <>
            <Header fontSize={mobile ? 1.75 : 2}>{"Technologies"}</Header>

            <Paragraph {...paragraphProps}>
                {"Across the years, I've worked with many technologies. Here are the ones I'm the most proficient in:"}
            </Paragraph>

            <IconsArray icons={proficientTechnologies} />

            <Paragraph {...paragraphProps}>
                {"And here are the ones with which I've had direct contact at some point:"}
            </Paragraph>

            <IconsArray icons={otherTechnologies} />
        </>
    );
};
