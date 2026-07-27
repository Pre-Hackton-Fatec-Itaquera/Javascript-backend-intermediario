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

import * as professorRepository from "#http/professor/repository/professorRepository.ts"
import { NotFoundError } from "#errors/notFoundError"

export const findAll = async () => {
    return await professorRepository.findAll()
}

export const findById = async (id: string) => {
    const professor = await professorRepository.findById(id)
    if (!professor) throw new NotFoundError("Professor não encontrado.")
    return professor
}

export const create = async (data: { name: string }) => {
    return await professorRepository.create(data)
}

export const update = async (id: string, data: { name?: string }) => {
    const professor = await professorRepository.findById(id)
    if (!professor) throw new NotFoundError("Professor não encontrado.")
    return await professorRepository.update(id, data)
}

export const remove = async (id: string) => {
    const professor = await professorRepository.findById(id)
    if (!professor) throw new NotFoundError("Professor não encontrado.")
    return await professorRepository.remove(id)
}
