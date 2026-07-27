// 📍 SERVICE (camada de aplicação)
//
// Este service tem uma particularidade: o método `create` captura
// o erro de unique constraint (23505) do PostgreSQL e traduz para
// um ConflictError (HTTP 409).
//
// O código 23505 é o código de erro do PostgreSQL para
// "unique_violation". Se o mesmo par (professorId, subjectId)
// já existir na tabela, o banco rejeita a inserção e o Drizzle
// propaga o erro do PostgreSQL.

import * as psRepository from "#http/professor-subject/repository/professorSubjectRepository.ts"
import { NotFoundError } from "#errors/notFoundError"
import { ConflictError } from "#errors/conflictError"

export const findAll = async (filters?: { professorId?: string; subjectId?: string }) => {
    return await psRepository.findAll(filters)
}

export const findById = async (id: string) => {
    const result = await psRepository.findById(id)
    if (!result) throw new NotFoundError("Vínculo não encontrado.")
    return result
}

export const create = async (data: { professorId: string; subjectId: string }) => {
    try {
        return await psRepository.create(data)
    } catch (error: any) {
        // 23505 = unique_violation no PostgreSQL
        if (error?.code === "23505") {
            throw new ConflictError("Este vínculo professor-matéria já existe.")
        }
        throw error
    }
}

export const remove = async (id: string) => {
    const link = await psRepository.findById(id)
    if (!link) throw new NotFoundError("Vínculo não encontrado.")
    return await psRepository.remove(id)
}

export const findAverage = async (id: string) => {
    const link = await psRepository.findById(id)
    if (!link) throw new NotFoundError("Vínculo não encontrado.")
    return await psRepository.findAverage(id)
}
