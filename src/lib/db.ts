import { PrismaClient } from "@/generated/prisma/client";
import { BunPostgresAdapter } from '@wargas/prisma-adapter-bun'

export const db = new PrismaClient({
    adapter: new BunPostgresAdapter({
        connectionString: process.env.DATABASE_URL!,
        maxConnections: 20
    }),
    log: [{
        emit: 'event',
        level: 'query'
    }]
})

db.$on('query', e => {
    if(e.query.includes('FROM "public"."orders"')) {

        console.log(e.query);
        console.log(e.params)
    }
})