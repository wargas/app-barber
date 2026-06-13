import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { method, omit, sumBy } from "lodash";
import { TRPCError } from "@trpc/server";
import { addHours, endOfDay, parse, startOfDay } from "date-fns";

export const ordersRouter = router({
    list: protectedProcedure
        .input(z.object({
            status: z.enum(['abertas', 'fechadas', 'todas']),
            start: z.string(),
            end: z.string()
        }))
        .query(async ({ input: { start, end, status }, ctx }) => {

            console.log(ctx)

            const startDate = startOfDay(parse(start, 'yyyy-MM-dd', new Date()))

            const endDate = endOfDay(parse(end, 'yyyy-MM-dd', new Date()));

            console.log({ startDate, endDate })

            return await db.order.findMany({
                where: {
                    ...status != 'todas' ? { done: status == 'fechadas' } : {},
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                    userid: ctx.userId
                },
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
                    id: opts.input,
                    userid: opts.ctx.userId
                },
                include: {
                    custumer: true,
                    orderServices: {
                        include: {
                            barber: true,
                            service: true
                        }
                    },
                    orderProducts: {
                        include: { product: true }
                    },
                    orderPayments: {
                        include: {
                            method: true
                        }
                    }
                }
            })
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {

            return await db.$transaction(async trx => {
                await trx.orderService.deleteMany({ where: { orderId: input, userid: ctx.userId } });
                await trx.orderProduct.deleteMany({ where: { orderid: input, userid: ctx.userId } });
                await trx.orderPayment.deleteMany({ where: { orderId: input, userid: ctx.userId } });

                return await trx.order.delete({ where: { id: input, userid: ctx.userId } })
            })

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
                    userid: opts.ctx.userId
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
                where: { id: opts.input.id, userid: opts.ctx.userId },
                include: { orderServices: true, orderProducts: true }
            })

            if (!order) {
                throw new TRPCError({ code: 'NOT_FOUND' })
            }

            const total = sumBy(order.orderServices, 'price') + sumBy(order.orderProducts, `total`)

            const totalPago = sumBy(opts.input.payment, 'value')

            if (total != totalPago) {
                throw new TRPCError({ code: 'CONFLICT', message: 'total pago diferente de total devido' })
            }

            return await db.order.update({
                where: { id: opts.input.id, userid: opts.ctx.userId },
                data: {
                    done: true, total, orderPayments: {
                        createMany: {
                            data: opts.input.payment.map(item => {
                                return {
                                    userid: opts.ctx.userId,
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
        .mutation(async ({ input, ctx }) => {
            const order = await db.order.findFirst({ where: { id: input.orderId } })

            return db.orderService.create({
                data: {
                    ...input,
                    custumerId: order?.custumerId,
                    userid: ctx.userId
                }
            })
        }),
    deleteService: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await db.orderService.delete({
            where: {
                id: input,
                userid: ctx.userId
            }
        })
    }),
    deleteProduct: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
        return await db.orderProduct.delete({
            where: {
                id: input,
                userid: ctx.userId
            }
        })
    }),
    addProduct: protectedProcedure.input(z.object({ orderId: z.string(), productId: z.string(), qty: z.number() }))
        .mutation(async ({ input, ctx }) => {
            const order = await db.order.findFirst({ where: { id: input.orderId, userid: ctx.userId }, include: { orderProducts: true } })
            const product = await db.product.findFirst({ where: { id: input.productId, userid: ctx.userId } })

            if (!product || !order) return null;

            const prevProduct = order.orderProducts.find(op => op.productid == product.id)

            if (prevProduct) {
                return await db.orderProduct.update({
                    where: {
                        id: prevProduct.id,
                        userid: ctx.userId
                    },
                    data: {
                        qty: prevProduct.qty + input.qty,
                        total: (prevProduct.qty + input.qty) * product.price
                    }
                })
            }

            return await db.orderProduct.create({
                data: {
                    orderid: input.orderId,
                    productid: input.productId,
                    qty: input.qty,
                    price: product.price,
                    total: input.qty * product.price,
                    userid: ctx.userId
                }
            })
        })

})