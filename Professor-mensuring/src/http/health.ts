import { type FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const checkHealth: FastifyPluginAsyncZod = async (server) => {
    server.get("/health", () => {
        return {
            status: "OK",
            timestamp: new Date().toISOString(),
        };
    })
}