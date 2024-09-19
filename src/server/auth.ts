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
import { compare } from "bcrypt";
import { env } from "@khenzii-dev/env";
import { db } from "@khenzii-dev/server/db";


export type User = NextAuthUser;

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: User;
    }
    interface User {
        id: string;
        email: string;
        name: string;
    }
}

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: "/",
        signOut: "/",
        error: "/",
        verifyRequest: "/",
        newUser: "/",
    },
    adapter: PrismaAdapter(db) as Adapter,
    session: {
        // This is required for `CredentialsProvider` to work.
        // See: https://next-auth.js.org/configuration/providers/credentials
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { type: "email" },
                password: { type: "password" },
            },
            async authorize(credentials): Promise<User | null> {
                if (env.ENV == "test") return {
                    id: "test-user",
                    email: "test.user@mail.com",
                    name: "Test User",
                };

                if (!credentials) return null;

                const account = await db.account.findFirst({
                    where: {
                        email: credentials.email,
                    },
                });

                if (!account) return null;

                const passwordValid = await compare(credentials.password, account.password);
                if (passwordValid) return account;

                return null;
            },
        }),
    ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
