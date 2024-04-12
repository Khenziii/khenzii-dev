import { createContext, type Dispatch, type SetStateAction } from 'react';
import { type option } from "@khenzii-dev/ui/atoms";

export type SelectContextProps = {
    currentSortOption: option;
    setCurrentSortOption: Dispatch<SetStateAction<option>>;
};

export const SelectContext = createContext<SelectContextProps>({
    currentSortOption: {
        text: "...",
        iconName: "question-lg",
    },
    setCurrentSortOption: () => {
        console.error("Select component requires context to work!");
    },
});
