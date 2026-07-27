import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as psService from "#http/professor-subject/services/ProfessorSubjectServices.ts";
import { professorSubjectSchema, averageSchema } from "#http/professor-subject/schemas/ProfessorSubjectSchema.ts";
import z from "zod";

const prefix = "/professor-subject"

export const professorSubjectRoutes: FastifyPluginAsyncZod = async (server) => {
    // GET /professor-subject — lista vínculos
    //
    // Aceita filtros opcionais via query string:
    //   ?professorId=xxx  — filtra por professor
    //   ?subjectId=xxx    — filtra por matéria
    //
    // Os filtros são combinados com AND (ex: ambos = vínculo específico)
    server.get(prefix, {
        schema: {
            querystring: z.object({
                professorId: z.string().optional(),
                subjectId: z.string().optional(),
            }),
            response: { 200: z.array(professorSubjectSchema) }
        }
    }, async (request) => {
        const query = request.query as { professorId?: string; subjectId?: string }
        return await psService.findAll(query)
    })

    // GET /professor-subject/:id — busca vínculo por ID
    server.get(`${prefix}/:id`, {
        schema: { response: { 200: professorSubjectSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await psService.findById(id)
    })

    // GET /professor-subject/:id/average — média das avaliações
    //
    // Retorna um objeto com:
    //   professorSubjectId: o ID do vínculo
    //   average: a média aritmética (0 se não houver avaliações)
    //   count: quantas avaliações entraram no cálculo
    server.get(`${prefix}/:id/average`, {
        schema: { response: { 200: averageSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await psService.findAverage(id)
    })

    // POST /professor-subject — cria vínculo
    //
    // Se o par (professorId, subjectId) já existir, retorna 409
    // (Conflict) em vez de 500 (Internal Server Error).
    server.post(prefix, {
        schema: {
            body: professorSubjectSchema.omit({ id: true }),
            response: { 201: professorSubjectSchema }
        }
    }, async (request, reply) => {
        const data = request.body as { professorId: string; subjectId: string }
        const result = await psService.create(data)
        reply.status(201)
        return result
    })

    // DELETE /professor-subject/:id — remove vínculo
    //
    // Não implementamos PUT aqui porque "atualizar" um vínculo
    // não faz sentido — você apaga o antigo e cria um novo.
    server.delete(`${prefix}/:id`, {
        schema: { response: { 200: professorSubjectSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await psService.remove(id)
    })
}
