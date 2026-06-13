import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { omit } from "lodash";

export const servicesRouter = router({
    list: protectedProcedure.query(async (opts) => {
        return await db.service.findMany({
            where: { userid: opts.ctx.userId }
        });
    }),
    show: protectedProcedure
        .input(z.string())
        .query(async (opts) => {
            return await db.service.findFirst({
                where: { id: opts.input, userid: opts.ctx.userId }
            });
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {

            return await db.service.delete({ where: { id: input, userid: ctx.userId } })
        }),
    create: protectedProcedure
        .input(z.object({ name: z.string(), price: z.number(), duration: z.number() }))
        .mutation(async opts => {

            const inserted = await db.service.create({
                data: {
                    ...opts.input,
                    userid: opts.ctx.userId
                }
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string(), price: z.number(), duration: z.number() }))
        .mutation(async opts => {

            const inserted = await db.service.update({
                where: { id: opts.input.id, userid: opts.ctx.userId },
                data: omit(opts.input, 'id')
            })

            return inserted;
        }),
})