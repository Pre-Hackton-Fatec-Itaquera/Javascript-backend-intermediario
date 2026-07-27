import Fastify from "fastify";
import {
    type ZodTypeProvider,
    serializerCompiler,
    validatorCompiler
} from "fastify-type-provider-zod";

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

server.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
    console.log("O servidor está rodando na porta");
});