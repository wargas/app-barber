import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";

export const barbersRouter = router({
    list: protectedProcedure.query(async () => {
        return await db.barber.findMany();
    }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input }) => {

            return await db.barber.delete({ where: { id: input } })
        }),
    create: protectedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async opts => {

            const inserted = await db.barber.create({
                data: {
                    name: opts.input.name,
                    isActive: true
                }
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({ name: z.string(), isActive: z.boolean() }))
        .mutation(async opts => {

            const inserted = await db.barber.create({
                data: {
                    name: opts.input.name,
                    isActive: opts.input.isActive
                }
            })

            return inserted;
        }),
})