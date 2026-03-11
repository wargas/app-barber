import { serve } from "bun";
import index from "./index.html";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./trpcs/routes/router";
import { createContext } from "./trpcs/trpc";

const server = serve({
  routes: {
    "/trpc/*": async (req: Request) => {

      if (req.method == 'OPTIONS') {
        return new Response('', {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': '*'
          }
        })
      }

      const response = await fetchRequestHandler({
        router: appRouter,
        endpoint: 'trpc',
        req,
        createContext
      })

      return response;
    },
    "/*": index
  },


  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
