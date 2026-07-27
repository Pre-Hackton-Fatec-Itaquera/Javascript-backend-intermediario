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
    // db.select().from(tabela) gera: SELECT * FROM tabela
    return await db.select().from(schema.subjects)
}

export const findById = async (id: string) => {
    // .where(eq(coluna, valor)) adiciona WHERE coluna = valor
    // O destructuring [result] pega o primeiro item do array
    // (retorna undefined se o array for vazio)
    const [result] = await db.select().from(schema.subjects).where(eq(schema.subjects.id, id))
    return result
}

export const create = async (data: { name: string; semester: number }) => {
    // .insert().values().returning() insere e devolve o registro
    // Sem o .returning(), o insert só confirma que deu certo.
    const [result] = await db.insert(schema.subjects).values(data).returning()
    return result
}

export const update = async (id: string, data: { name?: string; semester?: number }) => {
    // .set() aceita objeto PARCIAL — só envia pro SQL os campos
    // que foram passados, graças ao TypeScript com optional (?).
    const [result] = await db.update(schema.subjects).set(data).where(eq(schema.subjects.id, id)).returning()
    return result
}

export const remove = async (id: string) => {
    // .delete().where().returning() deleta e devolve o registro
    // que foi removido (ou undefined se nada foi deletado).
    const [result] = await db.delete(schema.subjects).where(eq(schema.subjects.id, id)).returning()
    return result
}
