import { Redis } from "@upstash/redis";

import { env } from "@/utils/env/server";

const cache = new Redis({
    url: env.UPSTASH_URL,
    token: env.UPSTASH_TOKEN,
})

export default cache
