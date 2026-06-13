import { db } from "@/lib/db";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { omit } from "lodash";

export const costumersRouter = router({
    list: protectedProcedure.query(async ({ctx}) => {
        return await db.costumer.findMany({
            where: { userid: ctx.userId }
        });
    }),
    paginate: protectedProcedure
        .input(z.object({ page: z.number() }))
        .query(async ({input: { page }, ctx}) => {
            const perpage = 10
            const skip = perpage * (page-1)

            const total = await db.costumer.count({
                where: { userid: ctx.userId }
            })

            const data = await db.costumer.findMany({
                where: { userid: ctx.userId },
                take: 10,
                skip,
                orderBy: { createdAt: 'desc'}
            });

            return {
                num_pages: Math.ceil(total/perpage), page,
                perPage: perpage,
                data, total
            }
        }),
    show: protectedProcedure
        .input(z.string())
        .query(async (opts) => {
            return await db.costumer.findFirst({
                where: { id: opts.input, userid: opts.ctx.userId }
            });
        }),
    delete: protectedProcedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {

            return await db.costumer.delete({ where: { id: input, userid: ctx.userId } })
        }),
    create: protectedProcedure
        .input(z.object({ name: z.string() }))
        .mutation(async opts => {

            const inserted = await db.costumer.create({
                data: {
                    ...opts.input,
                    userid: opts.ctx.userId
                },
                
            })

            return inserted;
        }),
    update: protectedProcedure
        .input(z.object({ name: z.string(), id: z.string() }))
        .mutation(async opts => {

            const inserted = await db.costumer.update({
                where: { id: opts.input.id, userid: opts.ctx.userId },
                data: omit(opts.input, 'id')
            })

            return inserted;
        }),
})