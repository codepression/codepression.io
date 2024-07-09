import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]),
    LASTFM_API_KEY: z.string().min(1),
    LASTFM_SHARED_SECRET: z.string().min(1),
    STEAM_API_KEY: z.string().min(1),
    STEAM_ID: z.string().min(1),
    VRCHAT_USERNAME: z.string().min(1),
    VRCHAT_PASSWORD: z.string().min(1),
    VRCHAT_TOTP: z.string().min(1),
    UPSTASH_URL: z.string().min(1),
    UPSTASH_TOKEN: z.string().min(1),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
