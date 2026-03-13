import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { omit } from "lodash";

export const costumersRouter = router({
    list: protectedProcedure.query(async () => {
        return await db.costumer.findMany();
    }),
    show: protectedProcedure
        .input(z.string())
        .query(async (opts) => {
            return await db.costumer.findFirst({
                where: { id: opts.input }
            });
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input }) => {

            return await db.costumer.delete({ where: { id: input } })
        }),
    create: protectedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async opts => {

            const inserted = await db.costumer.create({
                data: opts.input
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({ name: z.string(), id: z.string() }))
        .mutation(async opts => {

            const inserted = await db.costumer.update({
                where: { id: opts.input.id },
                data: omit(opts.input, 'id')
            })

            return inserted;
        }),
})