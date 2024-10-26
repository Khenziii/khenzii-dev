export * from "./trpc_provider";
export * from "./session_provider_wrapper";
export * from "./is_not_found_provider";
export * from "./are_socials_open_provider";

import type { ReactNode, FC } from "react";
import { TRPCProvider } from "./trpc_provider";
import { SessionProviderWrapper } from "./session_provider_wrapper";
import { IsNotFoundProvider } from "./is_not_found_provider";
import { AreSocialsOpenProvider } from "./are_socials_open_provider";

export type ProvidersProps = {
    children: ReactNode;
};

export const Providers: FC<ProvidersProps> = ({ children }) => (
    <TRPCProvider>
        <SessionProviderWrapper>
            <IsNotFoundProvider>
                <AreSocialsOpenProvider>
                    {children}
                </AreSocialsOpenProvider>
            </IsNotFoundProvider>
        </SessionProviderWrapper>
    </TRPCProvider>
);
