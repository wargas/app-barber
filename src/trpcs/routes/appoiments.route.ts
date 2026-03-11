import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { omit } from "lodash";

export const appoimentsRouter = router({
    list: protectedProcedure.query(async () => {
        return await db.appoiment.findMany();
    }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input }) => {

            return await db.appoiment.delete({ where: { id: input } })
        }),
    create: protectedProcedure
        .input(z.object({
            barberId: z.string(),
            custumerId: z.string(),
            serviceId: z.string(),
            price: z.number(),
            description: z.string()
        }))
        .mutation(async opts => {

            const inserted = await db.appoiment.create({
                data: opts.input
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({
            id: z.string(),
            barberId: z.string(),
            custumerId: z.string(),
            serviceId: z.string(),
            price: z.number(),
            description: z.string()
        }))
        .mutation(async opts => {

            const inserted = await db.appoiment.update({
                where: { id: opts.input.id },
                data: omit(opts.input, 'id')
            })

            return inserted;
        }),
})