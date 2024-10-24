import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { env } from "@khenzii-dev/env";
import { appRouter } from "@khenzii-dev/server/api/root";
import { createTRPCContext } from "@khenzii-dev/server/api/trpc";

const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers,
    });
};

const handler = (req: NextRequest) => {
    // default to application/json; charset=UTF-8 Content-Type
    if(!req.headers.get("content-type")) {
        req.headers.set("content-type", "application/json; charset=UTF-8");
    }

    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: appRouter,
        createContext: () => createContext(req),
        onError:
            env.NODE_ENV === "development"
                ? ({ path, error }) => {
                    console.error(`ERROR: tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
                }
                : undefined,
    });
};

export { handler as GET, handler as POST };
