import * as ratingRepository from "#http/ratings/repository/ratingRepository.ts"
import { NotFoundError } from "#errors/notFoundError"
import { BadRequestError } from "#errors/badRequestError"

export const findAll = async (filters?: { professorSubjectId?: string }) => {
    return await ratingRepository.findAll(filters)
}

export const findById = async (id: string) => {
    const rating = await ratingRepository.findById(id)
    if (!rating) throw new NotFoundError("Avaliação não encontrada.")
    return rating
}

export const create = async (data: { value: number; comment?: string | null; professorSubjectId: string }) => {
    // Validamos a nota no service também (além do CHECK no banco)
    // para dar uma resposta mais rápida e amigável ao cliente.
    if (data.value < 1 || data.value > 5) {
        throw new BadRequestError("A nota deve ser entre 1 e 5.")
    }
    return await ratingRepository.create(data)
}

export const update = async (id: string, data: { value?: number; comment?: string | null }) => {
    const rating = await ratingRepository.findById(id)
    if (!rating) throw new NotFoundError("Avaliação não encontrada.")
    if (data.value !== undefined && (data.value < 1 || data.value > 5)) {
        throw new BadRequestError("A nota deve ser entre 1 e 5.")
    }
    return await ratingRepository.update(id, data)
}

export const remove = async (id: string) => {
    const rating = await ratingRepository.findById(id)
    if (!rating) throw new NotFoundError("Avaliação não encontrada.")
    return await ratingRepository.remove(id)
}
