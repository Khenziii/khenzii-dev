import { PrismaAdapter } from "@auth/prisma-adapter";
import {
    getServerSession,
    type DefaultSession,
    type NextAuthOptions,
    // This type is imported as NextAuthUser because
    // it's later exported using the `User` name.
    type User as NextAuthUser,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
// import { env } from "@khenzii-dev/env";
import { db } from "@khenzii-dev/server/db";
import { api } from "@khenzii-dev/server/api";

export type User = NextAuthUser;

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: User;
    }
    interface User {
        id: string;
        email: string;
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    pages: {
        signIn: "/",
        signOut: "/",
        error: "/",
        verifyRequest: "/",
        newUser: "/",
    },
    adapter: PrismaAdapter(db) as Adapter,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials): Promise<User | null> {
                if (!credentials) return null;
                
                return await api.account.login(credentials);
            },
        }),
    ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
