import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
    type ZodTypeProvider,
    jsonSchemaTransform,
    serializerCompiler,
    validatorCompiler
} from "fastify-type-provider-zod";

const server = Fastify().withTypeProvider<ZodTypeProvider>();

server.register(fastifyCors, {
    origin: (origin, cb) => {
        const allowedOrigins = [
            "http://localhost:5173",
        ];

        if (!origin) return cb(null, true);
        const normalizedOrigin = origin.replace(/\/$/, "").toLowerCase();
        if (allowedOrigins.includes(normalizedOrigin)) return cb(null, true);     
        return cb(new Error("Permissão não concedida pelo CORS"), false);
    },

    credentials: true,
    methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
});

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);


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

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log("O servidor está rodando na porta");
});