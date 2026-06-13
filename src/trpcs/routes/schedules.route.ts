import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { omit } from "lodash";
import { addMinutes } from "date-fns";
import { TRPCError } from "@trpc/server";

export const schedulesRouter = router({
    list: protectedProcedure.query(async (opts) => {
        return await db.schedule.findMany({
            where: { userid: opts.ctx.userId },
            include: { barber: true, service: true }
        });
    }),
    show: protectedProcedure
        .input(z.string())
        .query(async (opts) => {
            return await db.schedule.findFirst({
                where: { id: opts.input, userid: opts.ctx.userId }
            });
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {

            return await db.schedule.delete({ where: { id: input, userid: ctx.userId } })
        }),
    create: protectedProcedure
        .input(z.object({ start: z.date(), client: z.string(), serviceId: z.string(), barberId: z.string() }))
        .mutation(async opts => {

            const service = await db.service.findFirst({ where: { id: opts.input.serviceId, userid: opts.ctx.userId } })

            if (!service) return new TRPCError({ code: "NOT_FOUND" })

            const end = addMinutes(opts.input.start, service.duration)

            const inserted = await db.schedule.create({
                data: {
                    clientName: opts.input.client,
                    serviceid: opts.input.serviceId,
                    barberid: opts.input.barberId,
                    start: opts.input.start,
                    end: end,
                    userid: opts.ctx.userId
                }
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({ id: z.string(), start: z.date(), serviceId: z.string(), barberId: z.string() }))
        .mutation(async opts => {

            const service = await db.service.findFirst({ where: { id: opts.input.serviceId, userid: opts.ctx.userId } })

            if (!service) return new TRPCError({ code: "NOT_FOUND" })

            const end = addMinutes(opts.input.start, service.duration)

            const inserted = await db.schedule.update({
                where: { id: opts.input.id, userid: opts.ctx.userId },
                data: { ...omit(opts.input, 'id'), end }
            })

            return inserted;
        }),
})