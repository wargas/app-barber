import { Navigate, type RouteObject } from "react-router";
import { authMiddleware } from "./lib/auth-middleware";

export const routes = [
    {
        path: '/',
        lazy: () => import("@/pages/layout"),
        children: [
            {
                path: '/',
                lazy: () => import('@/pages/admin/layout'),
                middleware: [authMiddleware],
                children: [
                    {
                        path: `/`,
                        element: <Navigate to={`/dashboard`} />
                    },
                    {
                        path: '/dashboard',
                        lazy: () => import('@/pages/admin/dashboard.page'),

                    },
                    {
                        path: '/clientes',
                        lazy: () => import('@/pages/admin/clientes.page')
                    },
                    {
                        path: '/barbeiros',
                        lazy: () => import('@/pages/admin/barbeiros.page')
                    },
                    {
                        path: '/servicos',
                        lazy: () => import('@/pages/admin/servicos.page')
                    },
                    {
                        path: '/produtos',
                        lazy: () => import('@/pages/admin/products.page')
                    },
                    

                    {
                        path: '/comandas',
                        lazy: () => import('@/pages/admin/comandas.page'),
                    },
                    {
                        path: '/comandas/:id',
                        lazy: () => import('@/pages/admin/create-comanda.page')
                    },
                    {
                        path: '/agenda',
                        lazy: () => import('@/pages/admin/agenda.page')
                    },
                    {
                        path: '/relatorio',
                        lazy: () => import('@/pages/admin/relatorio.page')
                    }
                ]
            },
            {
                path: '/login',
                lazy: () => import('@/pages/login.page')
            }
        ]
    },
    {
        path: `portal`,
        lazy: () => import("@/pages/portal/page")
    }

] satisfies RouteObject[]