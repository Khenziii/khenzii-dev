import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    // server side environment variables
    server: {
        DATABASE_URL: z
            .string()
            .url()
            .refine((str) => !str.includes("YOUR_MYSQL_URL_HERE"),
                "You forgot to change the default URL"),
        NODE_ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        ENV: z
            .enum(["development", "test", "production"])
            .default("development"),
        NEXTAUTH_SECRET:
            process.env.NODE_ENV === "production"
                ? z.string()
                : z.string().optional(),
        NEXTAUTH_URL:
            process.env.NODE_ENV === "production"
                ? z.string().url()
                : z.string().url().optional(),
    },
    // Client side environment variables. Exposing env vars to
    // the client requires prefixing them with `NEXT_PUBLIC_`.
    client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string(),
    },
    // `process.env` can't be destructed as a regular object in Next's
    // edge runtimes, or client side; so we need to destruct manually.
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        NODE_ENV: process.env.NODE_ENV,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        ENV: process.env.ENV,
        // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    // treat empty strings as undefined
    emptyStringAsUndefined: true,
});
