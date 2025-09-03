import { IconsArray, type IconsArrayProps } from "@khenzii-dev/ui/molecules";
import type { StoriesType } from "@khenzii-dev/ui/types";

export default {
    component: IconsArray,
    title: "IconsArray",
    tags: ["autodocs"],
};

export const Default: StoriesType<IconsArrayProps> = {
    args: {
        direction: "row",
        icons: ["github"],
    },
};
