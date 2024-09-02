// Shows children only if authenticated.

"use client";

import { type ReactNode, type FC } from "react";
import { useSession } from "next-auth/react";
import { Loading } from "@khenzii-dev/ui/atoms";
import { AdminLogin } from "@khenzii-dev/ui/organisms";

export type ProtectedPageProps = {
    children: ReactNode;
};

export const ProtectedPage: FC<ProtectedPageProps> = ({ children }) => {
    const { status } = useSession();

    if (status === "loading") return (
        <Loading size={150} />
    );

    if (status === "unauthenticated") return (
        <AdminLogin />
    );

    if (status === "authenticated") return (
        <>{children}</>
    );
};

