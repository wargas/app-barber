import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import type { AppRouter } from './trpcs/routes/router';

export type RouterOutput = inferRouterOutputs<AppRouter>
export type RouterInput = inferRouterInputs<AppRouter>

export type InputSignin = RouterInput['auth']['sigin']
export type InputCostumersCreate = RouterInput['custumers']['create']
export type InputServicesCreate = RouterInput['services']['create']