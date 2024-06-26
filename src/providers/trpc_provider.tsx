"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState, type ReactNode, type FC } from "react";
import SuperJSON from "superjson";
import { type AppRouter } from "@khenzii-dev/server/api/root";


let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = (): QueryClient => {
    if (typeof window === "undefined") {
        // Server: always make a new query client
        return new QueryClient();
    }

    // Browser: use singleton pattern to keep the same query client
    if (!clientQueryClientSingleton) {
        clientQueryClientSingleton = new QueryClient();
    }
    return clientQueryClientSingleton;
};

export const api = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
    if (typeof window !== "undefined") return window.location.origin;
    return `http://localhost:${process.env.PORT ?? 3000}`;
};


export type TRPCProviderProps = {
    children: ReactNode;
};

export const TRPCProvider: FC<TRPCProviderProps> = ({ children }) => {
    const queryClient = getQueryClient();
    const [trpcClient] = useState(() =>
        api.createClient({
            links: [
                loggerLink({
                    enabled: (op) =>
                        process.env.NODE_ENV === "development" ||
                        (op.direction === "down" && op.result instanceof Error),
                }),
                unstable_httpBatchStreamLink({
                    transformer: SuperJSON,
                    url: getBaseUrl() + "/api/trpc",
                    headers: () => {
                        const headers = new Headers();
                        headers.set("x-trpc-source", "nextjs-react");
                        return headers;
                    },
                }),
            ],
        }));

    return (
        <QueryClientProvider client={queryClient}>
            <api.Provider client={trpcClient} queryClient={queryClient}>
                {children}
            </api.Provider>
        </QueryClientProvider>
    );
};
