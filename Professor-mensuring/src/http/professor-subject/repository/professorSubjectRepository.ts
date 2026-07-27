// 📦 REPOSITORY (camada de dados)
//
// Este repository é o mais interessante do projeto porque ele:
//   1. Faz filtros dinâmicos (monta WHERE condicional)
//   2. Faz uma consulta agregada (AVG + COUNT) para calcular a média
//   3. Lida com a tabela intermediária (professor_subject)
//
// A tabela professor_subject é uma "tabela associativa" (pivot table)
// que resolve o relacionamento many-to-many entre professor e subject.

import { db } from "#db/connection.ts"
import { schema } from "#db/schemas/index.ts"
import { eq, and, sql } from "drizzle-orm"

export const findAll = async (filters?: { professorId?: string; subjectId?: string }) => {
    // 👇 Filtro dinâmico
    //
    // Em vez de criar rotas separadas como:
    //   GET /professor-subject?professorId=X
    //   GET /professor-subject?subjectId=Y
    //
    // Montamos um array de condições e SÓ adicionamos ao WHERE
    // se o filtro foi passado. O operador `and()` combina todas
    // as condições com AND no SQL.
    const conditions = []
    if (filters?.professorId) conditions.push(eq(schema.professorSubject.professorId, filters.professorId))
    if (filters?.subjectId) conditions.push(eq(schema.professorSubject.subjectId, filters.subjectId))

    const query = db.select().from(schema.professorSubject)
    if (conditions.length > 0) return query.where(and(...conditions))
    return await query
}

export const findById = async (id: string) => {
    const [result] = await db.select().from(schema.professorSubject).where(eq(schema.professorSubject.id, id))
    return result
}

export const create = async (data: { professorId: string; subjectId: string }) => {
    // Se o mesmo par (professorId, subjectId) já existir, o banco
    // lança um erro de unique constraint (definido no schema com
    // `unique().on(professorId, subjectId)`).
    //
    // O service captura esse erro e traduz para ConflictError (409).
    const [result] = await db.insert(schema.professorSubject).values(data).returning()
    return result
}

export const remove = async (id: string) => {
    const [result] = await db.delete(schema.professorSubject).where(eq(schema.professorSubject.id, id)).returning()
    return result
}

export const findAverage = async (id: string) => {
    // 👇 Consulta agregada com SQL
    //
    // AVG(value) calcula a média aritmética das notas.
    // COUNT(id) conta quantas avaliações existem.
    // round(...::numeric, 2) limita o resultado a 2 casas decimais.
    //
    // Diferente do resto do código que usa o Query Builder do Drizzle
    // (select(), where(), etc.), aqui usamos o sql tag do Drizzle
    // para escrever SQL "cru". O `${}` dentro do sql tag insere
    // referências de coluna de forma segura (sem SQL injection).
    const [result] = await db
        .select({
            average: sql<number>`round(avg(${schema.ratings.value})::numeric, 2)`,
            count: sql<number>`count(${schema.ratings.id})`,
        })
        .from(schema.ratings)
        .where(eq(schema.ratings.professorSubjectId, id))
    return { professorSubjectId: id, average: Number(result.average) || 0, count: Number(result.count) || 0 }
}
