"use client";

import type { ReactNode, FC } from "react";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export type SessionProviderWrapperProps = {
    session?: Session;
    children: ReactNode;
};

export const SessionProviderWrapper: FC<SessionProviderWrapperProps> = ({ session, children }) => (
    <SessionProvider session={session}>
        {children}
    </SessionProvider>
);

