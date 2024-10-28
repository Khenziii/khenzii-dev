export * from "./trpc_provider";
export * from "./session_provider_wrapper";
export * from "./is_not_found_provider";
export * from "./are_socials_open_provider";

import type { ReactNode, FC } from "react";
import { TRPCProvider } from "./trpc_provider";
import { SessionProviderWrapper } from "./session_provider_wrapper";
import { IsNotFoundProvider } from "./is_not_found_provider";
import { AreSocialsOpenProvider } from "./are_socials_open_provider";
import PlausibleProvider from "next-plausible";

export type ProvidersProps = {
    children: ReactNode;
};

export const Providers: FC<ProvidersProps> = ({ children }) => (
    <TRPCProvider>
        <SessionProviderWrapper>
            <IsNotFoundProvider>
                <AreSocialsOpenProvider>
                    <PlausibleProvider
                        domain={"khenzii.dev"}
                        customDomain={"https://plausible.khenzii.dev"}
                        selfHosted
                        trackOutboundLinks
                        trackFileDownloads
                    >
                        {children}
                    </PlausibleProvider>
                </AreSocialsOpenProvider>
            </IsNotFoundProvider>
        </SessionProviderWrapper>
    </TRPCProvider>
);
