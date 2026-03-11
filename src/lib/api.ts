import type { AppRouter } from "@/trpcs/routes/router";
import { createTRPCReact } from '@trpc/react-query';

export const api = createTRPCReact<AppRouter>()