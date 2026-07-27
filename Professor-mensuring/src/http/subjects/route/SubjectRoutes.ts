import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as subjectService from "#http/subjects/services/SubjectServices.ts";
import { subjectSchema } from "#http/subjects/schemas/SubjectSchema.ts";
import z from "zod";

// Cada entidade do sistema tem seu próprio prefixo de rota.
// O Fastify agrupa as rotas pelo prefixo, então todas as rotas
// de "subjects" começam com /subjects.
const prefix = "/subjects"

/**
 * Plugins no Fastify
 *
 * Diferente de outros frameworks que exportam um router e registram
 * rotas nele (ex: Express.Router()), o Fastify usa plugins.
 *
 * Um plugin é uma função assíncrona que recebe a instância do servidor
 * e registra rotas nela. Por trás dos panos, o Fastify cria um escopo
 * isolado para cada plugin — o que permite ter prefixos, hooks e
 * encapsulamento sem afetar o resto da aplicação.
 *
 * O tipo FastifyPluginAsyncZod é uma extensão do FastifyPluginAsync
 * padrão que adiciona suporte ao Zod para validação de schemas.
 */
export const subjectRoutes: FastifyPluginAsyncZod = async (server) => {

    // GET /subjects — lista todas as matérias
    //
    // O schema de resposta (`response: { 200: ... }`) faz duas coisas:
    // 1. Documenta automaticamente o Swagger (na rota /docs)
    // 2. Valida que o que o service retornou está no formato esperado
    server.get(prefix, {
        schema: { response: { 200: z.array(subjectSchema) } }
    }, async () => {
        return await subjectService.findAll()
    })

    // GET /subjects/:id — busca uma matéria pelo ID
    //
    // Os :id na URL viram `request.params.id`. O Fastify não valida
    // params automaticamente — nós tipamos manualmente com `as`.
    // Se o ID não existir no banco, o service lança um NotFoundError
    // que o errorHandler captura e devolve 404.
    server.get(`${prefix}/:id`, {
        schema: { response: { 200: subjectSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await subjectService.findById(id)
    })

    // POST /subjects — cria uma matéria
    //
    // Diferente do GET que usa o schema de response completo, aqui
    // usamos `.omit()` para remover campos que o cliente NÃO deve enviar:
    // - id: gerado automaticamente pelo banco (uuid defaultRandom)
    // - createdAt: gerado automaticamente pelo banco (timestamp defaultNow)
    //
    // O código de status 201 significa "Created" — semanticamente mais
    // correto que 200 para criação de recursos.
    server.post(prefix, {
        schema: {
            body: subjectSchema.omit({ id: true, createdAt: true }),
            response: { 201: subjectSchema }
        }
    }, async (request, reply) => {
        const data = request.body as { name: string; semester: number }
        const subject = await subjectService.create(data)
        reply.status(201)
        return subject
    })

    // PUT /subjects/:id — atualiza uma matéria
    //
    // Usamos `.partial()` para tornar todos os campos opcionais.
    // Isso permite que o cliente envie apenas os campos que quer
    // modificar, sem precisar reenviar o objeto inteiro.
    //
    // Se o ID não existir, o service lança NotFoundError.
    server.put(`${prefix}/:id`, {
        schema: {
            body: subjectSchema.omit({ id: true, createdAt: true }).partial(),
            response: { 200: subjectSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        const data = request.body as { name?: string; semester?: number }
        return await subjectService.update(id, data)
    })

    // DELETE /subjects/:id — remove uma matéria
    //
    // Se o ID não existir, o service lança NotFoundError.
    // O onDelete cascade do banco garante que os vínculos
    // (professor_subject) sejam removidos automaticamente.
    server.delete(`${prefix}/:id`, {
        schema: { response: { 200: subjectSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await subjectService.remove(id)
    })
}
