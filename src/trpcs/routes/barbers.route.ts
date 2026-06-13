import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";

export const barbersRouter = router({
    list: protectedProcedure.query(async ({ctx}) => {
        return await db.barber.findMany({
            where: { userid: ctx.userId }
        });
    }),
    show: protectedProcedure
        .input(z.string())
        .query(async (opts) => {
            return await db.barber.findFirst({
                where: { id: opts.input, userid: opts.ctx.userId }
            });
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {

            return await db.barber.delete({ where: { id: input, userid: ctx.userId } })
        }),
    create: protectedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async opts => {

            const inserted = await db.barber.create({
                data: {
                    name: opts.input.name,
                    userid: opts.ctx.userId,
                    isActive: true
                }
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({ name: z.string(), id: z.string(), isActive: z.boolean() }))
        .mutation(async opts => {

            const inserted = await db.barber.update({
                where: { id: opts.input.id, userid: opts.ctx.userId  },
                data: {
                    name: opts.input.name,
                    isActive: opts.input.isActive
                }
            })

            return inserted;
        }),
})