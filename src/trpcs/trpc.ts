import { initTRPC, TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import * as jose from 'jose'
import superjson from 'superjson'

export async function createContext({ req }: FetchCreateContextFnOptions) {

    if (req.headers.has('Authorization')) {
        const header = req.headers.get('Authorization')
        const token = header?.split(" ")[1] ?? ''
        const secret = new TextEncoder().encode('wrgs2703')

        const { payload } = await jose.jwtVerify(token, secret)

        return {
            userId: String(payload.id)
        }
    }

    return {
        userId: ''
    }
}

type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create({
    transformer: superjson
});

export const router = t.router;
export const mergeRouter = t.mergeRouters
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async function isAuthed(opts) {

    if (!opts.ctx.userId) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return opts.next()
})