import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { omit } from "lodash";

export const servicesRouter = router({
    list: protectedProcedure.query(async () => {
        return await db.service.findMany();
    }),
    show: protectedProcedure
        .input(z.string())
        .query(async (opts) => {
            return await db.service.findFirst({
                where: { id: opts.input }
            });
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input }) => {

            return await db.service.delete({ where: { id: input } })
        }),
    create: protectedProcedure
        .input(z.object({ name: z.string(), price: z.number(), duration: z.number() }))
        .mutation(async opts => {

            const inserted = await db.service.create({
                data: opts.input
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string(), price: z.number(), duration: z.number() }))
        .mutation(async opts => {

            const inserted = await db.service.update({
                where: { id: opts.input.id },
                data: omit(opts.input, 'id')
            })

            return inserted;
        }),
})