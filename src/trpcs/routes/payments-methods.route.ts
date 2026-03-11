import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";

export const paymentMethodsRouter = router({
    list: protectedProcedure.query(async () => {
        return await db.paymentMethods.findMany();
    })
})