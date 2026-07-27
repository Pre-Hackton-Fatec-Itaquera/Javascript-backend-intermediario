import { describe, it, expect, beforeEach, afterEach } from "vitest"
import * as ratingRepository from "#http/ratings/repository/ratingRepository.ts"
import * as professorRepository from "#http/professor/repository/professorRepository.ts"
import * as subjectRepository from "#http/subjects/repository/subjectRepository.ts"
import * as psRepository from "#http/professor-subject/repository/professorSubjectRepository.ts"

// 🧪 TESTES (vitest) — RatingRepository
//
// Este é o teste mais complexo porque ratings depende de 3 tabelas:
// professor → professor_subject → ratings.
// Por isso o beforeEach precisa criar professor, matéria E vínculo
// antes de cada teste.

describe("RatingRepository", () => {
    let psId: string
    let profId: string
    let subjId: string

    // beforeEach: cria a CADEIA completa de dependências.
    // 1. Cria um professor
    // 2. Cria uma matéria
    // 3. Cria o vínculo entre eles (professor_subject)
    // O teste então usa o psId para criar ratings.
    beforeEach(async () => {
        const prof = await professorRepository.create({ name: "Prof Avaliado" })
        profId = prof.id
        const subj = await subjectRepository.create({ name: "Matéria Avaliada", semester: 1 })
        subjId = subj.id
        const link = await psRepository.create({ professorId: profId, subjectId: subjId })
        psId = link.id
    })

    // afterEach: limpa na ORDEM INVERSA da criação.
    // Como ratings FK → professor_subject FK → professor + subject,
    // precisamos deletar na ordem inversa para não violar FK.
    afterEach(async () => {
        await psRepository.remove(psId).catch(() => {})
        await professorRepository.remove(profId).catch(() => {})
        await subjectRepository.remove(subjId).catch(() => {})
    })

    it("findAll deve retornar array", async () => {
        const result = await ratingRepository.findAll()
        expect(Array.isArray(result)).toBe(true)
    })

    it("findById deve retornar undefined para ID inexistente", async () => {
        const result = await ratingRepository.findById("00000000-0000-0000-0000-000000000000")
        expect(result).toBeUndefined()
    })

    it("create deve inserir avaliação", async () => {
        // ACT: cria avaliação com nota 5
        const result = await ratingRepository.create({ value: 5, professorSubjectId: psId })

        // ASSERT: verificamos value e a FK
        expect(result).toBeDefined()
        expect(result.value).toBe(5)
        expect(result.professorSubjectId).toBe(psId)

        // CLEANUP
        await ratingRepository.remove(result.id)
    })

    it("create com comment deve salvar comentário", async () => {
        const result = await ratingRepository.create({ value: 3, comment: "Bom professor", professorSubjectId: psId })
        expect(result.comment).toBe("Bom professor")
        await ratingRepository.remove(result.id)
    })

    it("update deve modificar value", async () => {
        // ARRANGE: cria avaliação com nota 2
        const created = await ratingRepository.create({ value: 2, professorSubjectId: psId })

        // ACT: altera para 4
        const updated = await ratingRepository.update(created.id, { value: 4 })

        // ASSERT
        expect(updated.value).toBe(4)

        // CLEANUP
        await ratingRepository.remove(created.id)
    })

    it("remove deve deletar avaliação", async () => {
        // ARRANGE
        const created = await ratingRepository.create({ value: 1, professorSubjectId: psId })

        // ACT
        await ratingRepository.remove(created.id)

        // ASSERT: a avaliação não existe mais
        const found = await ratingRepository.findById(created.id)
        expect(found).toBeUndefined()
    })

    it("findAll com filtro professorSubjectId", async () => {
        // ARRANGE: cria avaliação vinculada ao psId
        const created = await ratingRepository.create({ value: 5, professorSubjectId: psId })

        // ACT: filtra por professorSubjectId
        const result = await ratingRepository.findAll({ professorSubjectId: psId })

        // ASSERT: a avaliação criada aparece no resultado filtrado
        expect(result.some(r => r.id === created.id)).toBe(true)

        // CLEANUP
        await ratingRepository.remove(created.id)
    })
})
