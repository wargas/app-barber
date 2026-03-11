import { httpBatchLink } from "@trpc/client";
import { api } from "./lib/api";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip"

import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from "./routes";
import SuperJSON from "superjson";

const router = createBrowserRouter(routes)

export function AppProvider() {
    const queryClient = new QueryClient();
    const trpcClient = api.createClient({
        links: [
            httpBatchLink({
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
        ]
    })

    return (
        <api.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>

                <TooltipProvider>
                    <RouterProvider router={router} />
                </TooltipProvider>

            </QueryClientProvider>
            
        </api.Provider>
    )
}