"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type PropsWithChildren, type FC } from "react";

export const ReactQueryProvider: FC<PropsWithChildren> = ({ children  }) => {
    const [client] = useState(new QueryClient());

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
};
