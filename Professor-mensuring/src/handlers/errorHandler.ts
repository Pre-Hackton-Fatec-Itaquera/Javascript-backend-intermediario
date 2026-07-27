import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { apiError } from "#errors/apiError";
import { hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod";

// Error Handler centralizado.
//
// Em vez de cada rota ter seu próprio try/catch tratando erros,
// o Fastify chama ESTA função sempre que uma rota lança um erro
// (via `throw`). Isso mantém as rotas limpas: elas só lançam o erro
// certo (ex: `throw new NotFoundError()`) e esquecem o assunto.
export const errorHandler = (
    error: FastifyError,
    request: FastifyRequest,
    reply: FastifyReply
) => {

    // Importante: cada `if` aqui precisa de um `return`.
    //
    // O Fastify só permite UMA resposta por requisição. Sem o `return`,
    // depois de enviar a resposta de erro correta a função continuava
    // executando e caía no `reply.status(500).send(...)` do final,
    // tentando enviar uma SEGUNDA resposta — o que gera o erro
    // FST_ERR_REP_ALREADY_SENT.
    if(error instanceof apiError){
        return reply.status(error.status).send({
            statusCode: error.status,
            message: error.message,
            error: error.name
        })
    }

    // Erros de validação do Zod (ex: campo obrigatório faltando,
    // tipo errado) chegam aqui automaticamente, sem precisar de
    // nenhum código extra nas rotas.
    if(hasZodFastifySchemaValidationErrors(error)){
        return reply.status(400).send({
            statusCode: 400,
            message: "Erro de validação.",
            error: "Bad Request",
            issues: error.validation,
        });
    }

    // Erro ao tentar serializar a resposta de acordo com o schema
    // definido na rota (ex: o service retornou um campo que o
    // schema de resposta não espera).
    if (isResponseSerializationError(error)) {
        request.log.error(error);

        return reply.status(500).send({
            statusCode: 500,
            error: "Internal Server Error",
            message: "Erro ao serializar a resposta.",
        });
    }

    // Qualquer outro erro não previsto (bug, falha de infraestrutura, etc.)
    // cai aqui. Sempre logamos o erro original antes de responder,
    // porque o cliente só recebe uma mensagem genérica — os detalhes
    // ficam nos logs do servidor.
    request.log.error(error);

    return reply.status(500).send({
        statusCode: 500,
        error: "Internal Server Error",
        message: "Ocorreu um erro inesperado.",
    });
}