import type { AppRouter } from "@/trpcs/routes/router";
import { createTRPCReact } from '@trpc/react-query';
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import SuperJSON from "superjson";

export const api = createTRPCReact<AppRouter>()

const link = httpBatchLink({
    transformer: SuperJSON,
    url: '/trpc/',
    headers: () => {

        if (localStorage.getItem('token')) {
            return {
                'Authorization': `Bearer ${localStorage.getItem('token')!}`
            }
        }

        return {}
    }
})

export const client = createTRPCClient<AppRouter>({
    links: [link]
})

export const trpcClient = api.createClient({
    links: [link]
})