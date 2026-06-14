import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { addHours, endOfDay, format, isSameDay, parse, startOfDay, subDays, subHours } from "date-fns";
import { first, last, range, sumBy } from "lodash";

export const dashboardRouter = router({
    totais: protectedProcedure
        .input(z.object({start:z.string(), end: z.string()}))
        .query(async ({ ctx, input }) => {

        const startDate = subHours(startOfDay(parse(input.start, `yyyy-MM-dd`, new Date())), 3)
        const endDate = subHours(endOfDay(parse(input.end, `yyyy-MM-dd`, new Date())), 3)

        console.log({startDate, endDate})

        const barbers = await db.barber.count({ where: { userid: ctx.userId } })
        const services = await db.service.count({ where: { userid: ctx.userId } })
        const orders = await db.order.aggregate({
            where: { 
                userid: ctx.userId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                } 
            },
            _count: { id: true },
            _sum: { total: true }
        })

        return {
            barbers: barbers,
            servicos: services,
            orders: {
                count: orders._count.id,
                value: orders._sum.total
            }
        }
    }),
    lastDays: protectedProcedure
        .query(async({ctx}) => {
            
            const dates = range(15, 0).map(d => {
                return subDays(new Date(), d-1)
            })

            const orders = await db.order.findMany({
                where: {
                    createdAt: {
                        gte: startOfDay(addHours(first(dates)!, 3)),
                        lte: endOfDay(addHours(last(dates)!, 3))
                    },
                    userid: ctx.userId
                },
                include: {
                    services: true,
                    orderProducts: true,
                    orderServices: true
                }
            })


            return dates.map(d => {

                const order = orders.filter(o => isSameDay(d, o.createdAt))

                const services = sumBy(order?.flatMap(o => o.orderServices), `price`)
                const products = sumBy(order?.flatMap(o => o.orderProducts), `total`)

                const total = sumBy(order, `total`)

                return {
                    dia: format(d, `yyyy-MM-dd`),
                    services, products, total
                }
            })
        })
})