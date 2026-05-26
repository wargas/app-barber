import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";

export const dashboardRouter = router({
    totais: protectedProcedure.query(async() => {

        const barbers = await db.barber.count()
        const services = await db.service.count()
        const orders = await db.order.aggregate({
            _count: { id: true},
            _sum: { total: true}
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