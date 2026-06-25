import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { omit } from "lodash";

export const productsRouter = router({
    list: protectedProcedure
        .input(z.object({ name: z.string().optional() }).optional())
        .query(async ({ ctx, input }) => {
            return await db.product.findMany({
                where: {
                    userid: ctx.userId,
                    ...input?.name ? { name: { contains: input.name, mode: `insensitive` } } : {}
                }
            });
        }),
    show: protectedProcedure
        .input(z.string())
        .query(async (opts) => {
            return await db.product.findFirst({
                where: { id: opts.input, userid: opts.ctx.userId }
            });
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {

            return await db.product.delete({ where: { id: input, userid: ctx.userId } })
        }),
    create: protectedProcedure
        .input(z.object({ name: z.string(), price: z.number(), qty: z.number() }))
        .mutation(async opts => {

            const inserted = await db.product.create({
                data: {
                    ...opts.input,
                    userid: opts.ctx.userId
                }
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string(), price: z.number(), qty: z.number() }))
        .mutation(async opts => {

            const inserted = await db.product.update({
                where: { id: opts.input.id, userid: opts.ctx.userId },
                data: omit(opts.input, 'id')
            })

            return inserted;
        }),
})