import { randomUUIDv7 } from "bun";
import { mergeRouter, protectedProcedure, publicProcedure, router } from "../trpc";
import z from "zod";
import { db } from "../../lib/db";
import type { inferRouterOutputs } from "@trpc/server";
import { authRouter } from "./auth.router";
import { barbersRouter } from "./barbers.route";
import { costumersRouter } from "./costumers.route";
import { servicesRouter } from "./services.route";
import { ordersRouter } from "./orders.route";
import { paymentMethodsRouter } from "./payments-methods.route";
import { dashboardRouter } from "./dashboard.route";
import { productsRouter } from "./products.route";
import { schedulesRouter } from "./schedules.route";

export const appRouter = router({
    auth: authRouter,
    barbers: barbersRouter,
    custumers: costumersRouter,
    services: servicesRouter,
    orders: ordersRouter,
    paymentsMethods: paymentMethodsRouter,
    dashboard: dashboardRouter,
    products: productsRouter,
    schedules: schedulesRouter
})
export type AppRouter = typeof appRouter;

export type RouterOutput = inferRouterOutputs<AppRouter>