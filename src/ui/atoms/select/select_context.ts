import { createContext, type Dispatch, type SetStateAction } from 'react';
import { type option } from "@khenzii-dev/ui/atoms";

export type SelectContextProps = {
    currentOption: option;
    setCurrentOption: Dispatch<SetStateAction<option>>;
};

export const SelectContext = createContext<SelectContextProps>({
    currentOption: {
        text: "...",
        iconName: "question-lg",
    },
    setCurrentOption: () => {
        console.error("Select component requires context to work!");
    },
});
