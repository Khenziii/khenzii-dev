"use client";

import {
    createContext,
    useState,
    type Dispatch,
    type SetStateAction,
    type ReactNode,
    type FC,
} from "react";

export type IsNotFoundContextProps = {
    isNotFound: boolean;
    setIsNotFound: Dispatch<SetStateAction<boolean>>;
};

export const IsNotFoundContext = createContext<IsNotFoundContextProps>({
    isNotFound: false,
    setIsNotFound: () => {
        console.log("IsNotFoundContext needs to be initialized before usage!");
    },
});

export type IsNotFoundProviderProps = {
    children: ReactNode;
};

export const IsNotFoundProvider: FC<IsNotFoundProviderProps> = ({ children }) => {
    const [isNotFound, setIsNotFound] = useState(false);

    return (
        <IsNotFoundContext.Provider value={{ isNotFound, setIsNotFound }}>
            {children}
        </IsNotFoundContext.Provider>
    );
};
