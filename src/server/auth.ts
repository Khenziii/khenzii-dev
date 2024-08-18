import { PrismaAdapter } from "@auth/prisma-adapter";
import {
    getServerSession,
    // type DefaultSession,
    type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
// import { env } from "@khenzii-dev/env";
import { db } from "@khenzii-dev/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    // interface Session extends DefaultSession {
    //     user: {
    //         id: string;
    //         // ...other properties
    //         // role: UserRole;
    //     } & DefaultSession["user"];
    // }
    interface User {
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
    adapter: PrismaAdapter(db) as Adapter,
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // const res = await fetch("/your/endpoint", {
                //    method: 'POST',
                //    body: JSON.stringify(credentials),
                //    headers: { "Content-Type": "application/json" }
                // })
                // const user = await res.json()

                // if (res.ok && user) {
                //    return user
                // }

                // return null
    
                if (!credentials) return null;

                if (credentials.email == "a@b.c" && credentials.password == "test") return {
                    email: credentials.email,
                }

                return null;
            }
        }),
    ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
