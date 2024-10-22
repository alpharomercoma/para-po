import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    server: {
        DATABASE_URL: z.string().url(),
        GOOGLE_ID: z.string(),
        GOOGLE_SECRET: z.string(),
        NEXTAUTH_SECRET: z.string(),
    },
    client: {
    },
    runtimeEnv: {
        DATABASE_URL: process.env.DATABASE_URL,
        GOOGLE_ID: process.env.GOOGLE_ID,
        GOOGLE_SECRET: process.env.GOOGLE_SECRET,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    },
});