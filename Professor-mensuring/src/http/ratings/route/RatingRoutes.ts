import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as ratingService from "#http/ratings/services/RatingServices.ts";
import { ratingSchema } from "#http/ratings/schemas/RatingSchema.ts";
import z from "zod";

const prefix = "/ratings"

export const ratingRoutes: FastifyPluginAsyncZod = async (server) => {
    // GET /ratings — lista avaliações
    //
    // Filtro opcional:
    //   ?professorSubjectId=xxx  — avaliações de um vínculo específico
    server.get(prefix, {
        schema: {
            querystring: z.object({
                professorSubjectId: z.string().optional(),
            }),
            response: { 200: z.array(ratingSchema) }
        }
    }, async (request) => {
        const query = request.query as { professorSubjectId?: string }
        return await ratingService.findAll(query)
    })

    // GET /ratings/:id — busca avaliação por ID
    server.get(`${prefix}/:id`, {
        schema: { response: { 200: ratingSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await ratingService.findById(id)
    })

    // POST /ratings — cria avaliação
    //
    // O campo `value` é validado tanto pelo Zod (min(1).max(5))
    // quanto pelo CHECK constraint no banco e pelo service.
    server.post(prefix, {
        schema: {
            body: ratingSchema.omit({ id: true, createdAt: true }),
            response: { 201: ratingSchema }
        }
    }, async (request, reply) => {
        const data = request.body as { value: number; comment?: string | null; professorSubjectId: string }
        const rating = await ratingService.create(data)
        reply.status(201)
        return rating
    })

    // PUT /ratings/:id — atualiza avaliação
    //
    // Use cases futuros: IA pode censurar palavras no comment
    // ou moderador pode ajustar a nota.
    server.put(`${prefix}/:id`, {
        schema: {
            body: ratingSchema.omit({ id: true, createdAt: true }).partial(),
            response: { 200: ratingSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        const data = request.body as { value?: number; comment?: string | null }
        return await ratingService.update(id, data)
    })

    // DELETE /ratings/:id — remove avaliação
    server.delete(`${prefix}/:id`, {
        schema: { response: { 200: ratingSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await ratingService.remove(id)
    })
}
