export * from "./accounts";

import { type FC, useContext } from "react";
import { AreSocialsOpenContext } from "@khenzii-dev/providers";
import { useMobile } from "@khenzii-dev/hooks";
import {
    Flex,
    Header,
    Paragraph,
} from "@khenzii-dev/ui/atoms";
import style from "./index.module.scss";

export type ContactProps = {
    openDialog: () => void;
};

export const Contact: FC<ContactProps> = ({ openDialog }) => {
    const { setAreSocialsOpen } = useContext(AreSocialsOpenContext);
    const mobile = useMobile();

    return (
        <Flex direction={"column"} align={"flex-start"}>
            <Header fontSize={mobile ? 1.75 : 2}>Contact</Header>
    
            <Paragraph fontSize={1.25} styles={{ width: "fit-content" }}>
                {"If you want to contact me, I'm the most likely to give a quick response "}
                <span onClick={() => setAreSocialsOpen(true)} className={style.span}>{"here"}</span>
                {", I use those platforms the most."}
            </Paragraph>

            <Paragraph fontSize={1.25}>
                {"However, you can also find me on "}
                <span onClick={openDialog} className={style.span}>{"various sites"}</span>
                {" all over the web!"}
            </Paragraph>
        </Flex>
    );
};
