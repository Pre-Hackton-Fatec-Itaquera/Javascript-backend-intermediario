// 📍 SERVICE (camada de aplicação)
//
// O service é ONDE a lógica de negócio mora.
//
// Regra prática: se tem "if" que toma decisão de negócio,
// está no lugar certo. Repare que o service não importa
// nada do Fastify, do banco, ou do schema Zod — ele só
// chama o repository e aplica regras.
//
// Vantagens dessa separação:
//   - Se amanhã precisarmos chamar a mesma regra de negócio
//     de um job agendado (cron) ou de uma fila (RabbitMQ),
//     reaproveitamos o service sem tocar na rota.
//   - Se trocarmos o banco de Postgres para MongoDB, só o
//     repository muda — o service continua o mesmo.

import * as subjectRepository from "#http/subjects/repository/subjectRepository.ts"
import { NotFoundError } from "#errors/notFoundError"

export const findAll = async () => {
    return await subjectRepository.findAll()
}

export const findById = async (id: string) => {
    // AQUI mora a regra: "se não encontrar, dá 404".
    // O repository retorna undefined (sem lançar erro),
    // e o service decide o que fazer com isso.
    const subject = await subjectRepository.findById(id)
    if (!subject) throw new NotFoundError("Matéria não encontrada.")
    return subject
}

export const create = async (data: { name: string; semester: number }) => {
    return await subjectRepository.create(data)
}

export const update = async (id: string, data: { name?: string; semester?: number }) => {
    // Antes de atualizar, verificamos se o registro existe.
    // Isso evita um UPDATE silencioso em nada e retorna 404.
    const subject = await subjectRepository.findById(id)
    if (!subject) throw new NotFoundError("Matéria não encontrada.")
    return await subjectRepository.update(id, data)
}

export const remove = async (id: string) => {
    const subject = await subjectRepository.findById(id)
    if (!subject) throw new NotFoundError("Matéria não encontrada.")
    return await subjectRepository.remove(id)
}
