import { PrismaClient } from "@/generated/prisma/client";
import { BunPostgresAdapter } from '@wargas/prisma-adapter-bun'

export const db = new PrismaClient({
    adapter: new BunPostgresAdapter({
        connectionString: process.env.DATABASE_URL!,
        maxConnections: 20
    })
})