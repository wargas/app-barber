import z from "zod";
import { protectedProcedure, publicProcedure, router } from "../trpc";
import { db } from "@/lib/db";
import { TRPCError } from "@trpc/server";
import * as jose from 'jose'
import { use } from "react";
import _ from "lodash";

export const authRouter = router({
    signup: publicProcedure
        .input(z.object({
            name: z.string(),
            email: z.email(),
            password: z.string()
        }))
        .mutation(async ({ input }) => {
            input.password = Bun.password.hashSync(input.password)
            return await db.user.create({ data: input })
        }),
    sigin: publicProcedure
        .input(z.object({
            password: z.string(),
            email: z.email(),
        }))
        .mutation(async ({ input }) => {
            const user = await db.user.findFirst({ where: { email: input.email } })

            if (!user) {
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            }

            if (!Bun.password.verifySync(input.password, user.password)) {
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            }

            const secret = new TextEncoder().encode('wrgs2703')

            const token = await new jose.SignJWT({ id: user.id })
                .setProtectedHeader({ alg: 'HS256' })
                .sign(secret)


            return { token, type: 'Bearer' };
        }),
    me: protectedProcedure.query(async ({ ctx }) => {
        const user = await db.user.findFirst({ where: { id: ctx.userId }, omit: { password: true } })

        const avatar = 'https://gravatar.com/avatar/'+Bun.SHA256.hash(user?.email!, 'hex')

        return {...user!, avatar}
    })
})