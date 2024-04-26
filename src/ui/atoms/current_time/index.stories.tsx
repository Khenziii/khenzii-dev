import { CurrentTime, type CurrentTimeProps } from "@khenzii-dev/ui/atoms";
import { type StoriesType } from "@khenzii-dev/ui/types/stories-type";

export default {
    component: CurrentTime,
    title: 'CurrentTime',
    tags: ['autodocs'],
};

export const Default: StoriesType<CurrentTimeProps> = {
    args: {
        timezone: "Europe/Warsaw",
        accuracy: "minutes",
    },
};
