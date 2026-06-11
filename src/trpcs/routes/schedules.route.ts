import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { omit } from "lodash";
import { addMinutes } from "date-fns";
import { TRPCError } from "@trpc/server";

export const schedulesRouter = router({
    list: protectedProcedure.query(async () => {
        return await db.schedule.findMany({
            include: { barber: true, service: true}
        });
    }),
    show: protectedProcedure
        .input(z.string())
        .query(async (opts) => {
            return await db.schedule.findFirst({
                where: { id: opts.input }
            });
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input }) => {

            return await db.schedule.delete({ where: { id: input } })
        }),
    create: protectedProcedure
        .input(z.object({ start: z.date(), client: z.string(), serviceId: z.string(), barberId: z.string() }))
        .mutation(async opts => {

            const service = await db.service.findFirst({ where: { id: opts.input.serviceId } })

            if (!service) return new TRPCError({ code: "NOT_FOUND" })

            const end = addMinutes(opts.input.start, service.duration)

            const inserted = await db.schedule.create({
                data: {
                    clientName: opts.input.client,
                    serviceid: opts.input.serviceId,
                    barberid: opts.input.barberId,
                    start: opts.input.start,
                    end: end
                }
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({ id: z.string(), start: z.date(), serviceId: z.string(), barberId: z.string() }))
        .mutation(async opts => {

            const service = await db.service.findFirst({ where: { id: opts.input.serviceId } })

            if (!service) return new TRPCError({ code: "NOT_FOUND" })

            const end = addMinutes(opts.input.start, service.duration)

            const inserted = await db.schedule.update({
                where: { id: opts.input.id },
                data: { ...omit(opts.input, 'id'), end }
            })

            return inserted;
        }),
})