import { api, trpcClient } from "./lib/api";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from "@/components/ui/tooltip"

import { createBrowserRouter, RouterProvider } from 'react-router'
import { routes } from "./routes";

const router = createBrowserRouter(routes)


export function AppProvider() {
    const queryClient = new QueryClient();


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