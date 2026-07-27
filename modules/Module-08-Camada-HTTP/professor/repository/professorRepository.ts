// 📦 REPOSITORY (camada de dados)
//
// O repository é a ÚNICA camada que sabe que o banco existe.
// A função de cada arquivo aqui é traduzir chamadas de função
// em consultas SQL (via Drizzle ORM).
//
// Regras do repository:
//   - NÃO toma decisão de negócio (não tem ifs de regra)
//   - NÃO lança erros HTTP (não importa NotFoundError)
//   - Retorna null/undefined quando não encontra — quem decide
//     o que fazer é o service
//
// Depois que você entende esse padrão, fica fácil: se precisar
// mudar de SQLite para Postgres, ou de Drizzle para Prisma,
// você mexe SÓ aqui.

import { db } from "#db/connection.ts"
import { schema } from "#db/schemas/index.ts"
import { eq } from "drizzle-orm"

export const findAll = async () => {
    return await db.select().from(schema.professor)
}

export const findById = async (id: string) => {
    const [result] = await db.select().from(schema.professor).where(eq(schema.professor.id, id))
    return result
}

export const create = async (data: { name: string }) => {
    const [result] = await db.insert(schema.professor).values(data).returning()
    return result
}

export const update = async (id: string, data: { name?: string }) => {
    const [result] = await db.update(schema.professor).set(data).where(eq(schema.professor.id, id)).returning()
    return result
}

export const remove = async (id: string) => {
    const [result] = await db.delete(schema.professor).where(eq(schema.professor.id, id)).returning()
    return result
}
