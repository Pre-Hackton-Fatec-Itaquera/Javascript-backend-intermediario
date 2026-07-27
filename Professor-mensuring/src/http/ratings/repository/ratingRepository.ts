import { db } from "#db/connection.ts"
import { schema } from "#db/schemas/index.ts"
import { eq } from "drizzle-orm"

export const findAll = async (filters?: { professorSubjectId?: string }) => {
    const query = db.select().from(schema.ratings)
    if (filters?.professorSubjectId) {
        return query.where(eq(schema.ratings.professorSubjectId, filters.professorSubjectId))
    }
    return await query
}

export const findById = async (id: string) => {
    const [result] = await db.select().from(schema.ratings).where(eq(schema.ratings.id, id))
    return result
}

export const create = async (data: { value: number; comment?: string | null; professorSubjectId: string }) => {
    const [result] = await db.insert(schema.ratings).values(data).returning()
    return result
}

export const update = async (id: string, data: { value?: number; comment?: string | null }) => {
    const [result] = await db.update(schema.ratings).set(data).where(eq(schema.ratings.id, id)).returning()
    return result
}

export const remove = async (id: string) => {
    const [result] = await db.delete(schema.ratings).where(eq(schema.ratings.id, id)).returning()
    return result
}
