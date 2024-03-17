"use client";

import { useState } from "react";
import { Logo, Paragraph, Anchor, Flex, Icon } from "@khenzii-dev/ui/atoms";
import { Expandable } from "@khenzii-dev/ui/molecules";

const Home = () => {
    const [firstExpanded, setFirstExpanded] = useState(false);
    const [secondExpanded, setSecondExpanded] = useState(false);

    return (
        <>
            <Logo animate={true} size={300}/>

            <Paragraph fontSize={1.5} styles={{ textAlign: "center" }}>
                Hello! This page is being rebuilt. While waiting, visit old version of the site; it can be found <Anchor
                href={"https://old.khenzii.dev/"} newTab prefetch darkenOnHover>here</Anchor>.
            </Paragraph>

            <button onClick={() => setFirstExpanded(!firstExpanded)}>click me!</button>
            <Expandable
                startHeight={"0"}
                startWidth={"0"}
                endHeight={"500px"}
                endWidth={"500px"}
                wrapOutOfFlow={false}
                isExpanded={firstExpanded}
            >
                <Flex direction={"column"} align={"flex-start"} justify={"flex-start"} gap={0} styles={{ height: "100%", width: "100%" }}>
                    <button onClick={() => setFirstExpanded(false)}>
                        <Icon iconName={"x-lg"}/>
                    </button>

                    <div>
                        <Anchor href={"#"} prefetch={false} newTab>
                            <Icon iconName={"justify"} size={4}/>
                        </Anchor>

                        <Anchor href={"#"} prefetch={false} newTab>
                            <Icon iconName={"justify"} size={4}/>
                        </Anchor>
                    </div>
                </Flex>
            </Expandable>

            <button onClick={() => setSecondExpanded(!secondExpanded)}>click me!</button>
            <Expandable
                startHeight={"0"}
                startWidth={"0"}
                endHeight={"500px"}
                endWidth={"500px"}
                wrapOutOfFlow={false}
                isExpanded={secondExpanded}
            >
                <Paragraph>something</Paragraph>
            </Expandable>
        </>
    );
};

export default Home;
