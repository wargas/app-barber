import { createContext, redirect, type MiddlewareFunction } from "react-router"
import { api, client } from "./api"
import type { RouterOutput } from "@/types"


export const authMiddleware: MiddlewareFunction = async ({ request, context }, next) => {
    if (!localStorage.getItem('token')) {
        return redirect('/login')
    }

    console.log('middleware')

    await next()

}