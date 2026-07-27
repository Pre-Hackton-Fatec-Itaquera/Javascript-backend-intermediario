import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import Fastify from "fastify";
import {
    type ZodTypeProvider,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler
} from "fastify-type-provider-zod";
import { checkHealth } from "#http/health.ts";
import { env } from "#lib/env";
import { errorHandler } from "#handlers/errorHandler";
import { getProfessor } from "#http/professor/route/ProfessorRoutes.ts";
import { subjectRoutes } from "#http/subjects/route/SubjectRoutes.ts";
import { professorSubjectRoutes } from "#http/professor-subject/route/ProfessorSubjectRoutes.ts";
import { ratingRoutes } from "#http/ratings/route/RatingRoutes.ts";

// O que é um servidor?

// Antes do Fastify, imagine um restaurante.

// O cliente faz um pedido.
// O garçom recebe o pedido.
// O garçom leva para a cozinha.
// A cozinha prepara a comida.
// O garçom entrega ao cliente.

// Um servidor HTTP faz exatamente isso.
const server = Fastify().withTypeProvider<ZodTypeProvider>();

// Configura o Zod como responsável por validar requisições
// e serializar respostas do Fastify.
server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

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

/**
 * Swagger
 *
 * Gera automaticamente a documentação da API
 * a partir dos schemas definidos nas rotas.
 */
server.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Hackathon Fatec Itaquera",
            version: "0.0.0.1",
            description: "Projeto desenvolvido para o Pré-Hackathon."
        }
    },

    // Converte os schemas do Zod para o formato OpenAPI.
    transform: jsonSchemaTransform
});

/**
 * Interface gráfica do Swagger.
 *
 * A documentação ficará disponível em:
 * http://localhost:3333/docs
 */
server.register(fastifySwaggerUi, {
    routePrefix: "/docs"
});

// server.listen({ port: Number(env.PORT) || 8000, host: '0.0.0.0' }).then(() => {
//     console.log(`HTTP Server is running! port:${env.PORT}`)
// })

server.setErrorHandler(errorHandler)
server.register(checkHealth);

server.register(getProfessor);
server.register(subjectRoutes);
server.register(professorSubjectRoutes);
server.register(ratingRoutes);

server.listen({ port: Number(env.PORT )|| 3333, host: '0.0.0.0' }).then(() => {
    console.log(`O servidor está rodando na porta ${env.PORT}`);
});