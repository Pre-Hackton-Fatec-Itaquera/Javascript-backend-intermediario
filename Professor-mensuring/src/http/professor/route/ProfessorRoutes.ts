import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as professorService from "#http/professor/services/ProfessorServices.ts";
import { professorSchema } from "#http/professor/schemas/ProfessorSchema.ts";
import z from "zod";

const prefix = "/professor"

// 🚏 ROTAS (camada de transporte)
//
// As rotas são a "porta de entrada" da aplicação. Cada método
// HTTP (GET, POST, PUT, DELETE) vira um handler que:
//
//   1. Recebe a requisição (params, body, query)
//   2. Chama o service (que tem a lógica de negócio)
//   3. Devolve a resposta
//
// NENHUMA lógica de negócio fica aqui. Se um if não for sobre
// "qual status code retornar", ele não pertence à rota.
export const getProfessor: FastifyPluginAsyncZod = async (server) => {
    // GET /professor — lista todos ou filtra por nome.
    // A busca fica aqui na rota porque o Fastify já entrega o `query`
    // validado e o service recebe só o filtro que interessa.
    server.get(prefix, {
        schema: {
            querystring: z.object({
                name: z.string().optional(),
            }),
            response: { 200: z.array(professorSchema) }
        }
    }, async (request) => {
        const { name } = request.query as { name?: string }
        return await professorService.findAll({ name })
    })

    // GET /professor/:id — busca por ID
    server.get(`${prefix}/:id`, {
        schema: {
            response: { 200: professorSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await professorService.findById(id)
    })

    // POST /professor — cria
    //
    // .omit({ id: true }) no body: o cliente não envia o id
    // (o banco gera automaticamente via uuid + defaultRandom)
    server.post(prefix, {
        schema: {
            body: professorSchema.omit({ id: true }),
            response: { 201: professorSchema }
        }
    }, async (request, reply) => {
        const data = request.body as { name: string }
        const professor = await professorService.create(data)
        reply.status(201)
        return professor
    })

    // PUT /professor/:id — atualização parcial
    //
    // .partial() transforma todos os campos em opcionais,
    // permitindo enviar SÓ o campo que vai mudar.
    server.put(`${prefix}/:id`, {
        schema: {
            body: professorSchema.omit({ id: true }).partial(),
            response: { 200: professorSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        const data = request.body as { name?: string }
        return await professorService.update(id, data)
    })

    // DELETE /professor/:id — remove
    server.delete(`${prefix}/:id`, {
        schema: {
            response: { 200: professorSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await professorService.remove(id)
    })
}