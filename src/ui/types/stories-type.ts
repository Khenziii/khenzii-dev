import { type Meta } from "@storybook/react";

export type StoriesType<T> = Omit<Meta, "args"> & {
    args: T;
};
