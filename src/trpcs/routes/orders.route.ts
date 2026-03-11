import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { method, omit, sumBy } from "lodash";
import { TRPCError } from "@trpc/server";

export const ordersRouter = router({
    list: protectedProcedure.query(async () => {
        return await db.order.findMany({
            include: {
                custumer: true, orderServices: {
                    include: { service: true }
                }
            }
        });
    }),
    show: protectedProcedure
        .input(z.string())
        .query(async (opts) => {
            return await db.order.findFirst({
                where: {
                    id: opts.input
                },
                include: {
                    custumer: true,
                    orderServices: {
                        include: {
                            barber: true,
                            service: true
                        }
                    },
                    orderPayments: true
                }
            })
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input }) => {

            return await db.order.delete({ where: { id: input } })
        }),
    create: protectedProcedure
        .input(z.object({
            custumerId: z.string(),
        }))
        .mutation(async opts => {
            const inserted = await db.order.create({
                data: {
                    total: 0,
                    custumerId: opts.input.custumerId,
                }
            })

            return inserted;
        }),
    close: protectedProcedure
        .input(z.object({
            id: z.string(),
            payment: z.array(z.object({
                methodId: z.string(),
                value: z.number()
            }))
        }))
        .mutation(async opts => {

            const order = await db.order.findFirst({
                where: { id: opts.input.id },
                include: { orderServices: true }
            })

            if (!order) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const total = sumBy(order.orderServices, 'price')

            const totalPago = sumBy(opts.input.payment, 'value')

            if (total != totalPago) {
                throw new TRPCError({ code: 'CONFLICT', message: 'total pago diferente de total devido' })
            }

            return await db.order.update({
                where: { id: opts.input.id },
                data: {
                    done: true, total, orderPayments: {
                        createMany: {
                            data: opts.input.payment.map(item => {
                                return {
                                    methodId: item.methodId,
                                    value: item.value,
                                }
                            })
                        }
                    }
                },

            })


        }),
    addService: protectedProcedure.input(z.object({
        orderId: z.string(),
        barberId: z.string(),
        serviceId: z.string(),
        price: z.number(),
        description: z.string(),
    }))
        .mutation(async ({ input }) => {
            const order = await db.order.findFirst({ where: { id: input.orderId } })

            return db.orderService.create({
                data: {
                    ...input,
                    custumerId: order?.custumerId
                }
            })
        }),
    deleteService: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
        return await db.orderService.delete({
            where: {
                id: input
            }
        })
    })

})