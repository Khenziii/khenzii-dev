"use client";

import {
    createContext,
    useState,
    type Dispatch,
    type SetStateAction,
    type ReactNode,
    type FC,
} from "react";

export type AreSocialsOpenContextProps = {
    areSocialsOpen: boolean;
    setAreSocialsOpen: Dispatch<SetStateAction<boolean>>;
};

export const AreSocialsOpenContext = createContext<AreSocialsOpenContextProps>({
    areSocialsOpen: false,
    setAreSocialsOpen: () => {
        console.log("AreSocialsOpenContext needs to be initialized before usage!");
    },
});

export type AreSocialsOpenProviderProps = {
    children: ReactNode;
};

export const AreSocialsOpenProvider: FC<AreSocialsOpenProviderProps> = ({ children }) => {
    const [areSocialsOpen, setAreSocialsOpen] = useState(false);

    return (
        <AreSocialsOpenContext.Provider value={{ areSocialsOpen, setAreSocialsOpen }}>
            {children}
        </AreSocialsOpenContext.Provider>
    );
};
