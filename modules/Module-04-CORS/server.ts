import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import {
    type ZodTypeProvider,
    serializerCompiler,
    validatorCompiler
} from "fastify-type-provider-zod";

const server = Fastify().withTypeProvider<ZodTypeProvider>();

/**
 * CORS (Cross-Origin Resource Sharing)
 *
 * O navegador bloqueia requisições entre origens diferentes
 * por questões de segurança.
 *
 * Aqui definimos quais endereços podem consumir nossa API.
 */
server.register(fastifyCors, {
    origin: (origin, cb) => {
        const allowedOrigins = [
            "http://localhost:5173",
        ];

        // Permite ferramentas como Postman ou requisições sem Origin.
        if (!origin) return cb(null, true);

        // Remove a barra final e converte para minúsculas
        // para evitar diferenças na comparação.
        const normalizedOrigin = origin.replace(/\/$/, "").toLowerCase();

        // Verifica se a origem está na lista de permitidas.
        if (allowedOrigins.includes(normalizedOrigin)) {
            return cb(null, true);
        }

        console.warn("CORS bloqueado para origin", origin);
        return cb(new Error("Permissão não concedida pelo CORS"), false);
    },

    credentials: true,
    methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
});

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log("O servidor está rodando na porta");
});