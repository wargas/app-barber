import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";

export const dashboardRouter = router({
    totais: protectedProcedure.query(async ({ ctx }) => {

        const barbers = await db.barber.count({ where: { userid: ctx.userId } })
        const services = await db.service.count({ where: { userid: ctx.userId } })
        const orders = await db.order.aggregate({
            where: { userid: ctx.userId },
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
    })
})