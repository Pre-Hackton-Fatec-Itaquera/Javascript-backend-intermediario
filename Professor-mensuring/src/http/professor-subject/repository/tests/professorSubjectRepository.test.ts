import { describe, it, expect, beforeEach, afterEach } from "vitest"
import * as psRepository from "#http/professor-subject/repository/professorSubjectRepository.ts"
import * as professorRepository from "#http/professor/repository/professorRepository.ts"
import * as subjectRepository from "#http/subjects/repository/subjectRepository.ts"

// 🧪 TESTES (vitest) — ProfessorSubjectRepository
//
// Este arquivo testa especificamente a tabela associativa.
// Diferente dos outros testes (que criam dados dentro de cada
// teste), aqui usamos beforeEach/afterEach porque precisamos
// de professor E matéria válidos para criar um vínculo —
// e essa preparação é a MESMA para todos os testes.

describe("ProfessorSubjectRepository", () => {
    // Variáveis declaradas fora do beforeEach, mas preenchidas
    // dentro dele. Isso permite que os testes (`it`) acessem
    // os IDs criados.
    let professorId: string
    let subjectId: string

    // beforeEach roda ANTES de CADA teste (`it`).
    // Isso garante que cada teste comece com dados frescos,
    // sem depender do estado deixado por testes anteriores.
    beforeEach(async () => {
        const prof = await professorRepository.create({ name: "Prof Teste" })
        professorId = prof.id
        const subj = await subjectRepository.create({ name: "Matéria Teste", semester: 1 })
        subjectId = subj.id
    })

    // afterEach roda DEPOIS de CADA teste — limpamos os dados
    // que criamos para não poluir o banco nem afetar os testes
    // seguintes.
    afterEach(async () => {
        // O .catch(() => {}) evita que o teste quebre se o
        // registro já tiver sido deletado por outro motivo.
        if (professorId) await professorRepository.remove(professorId).catch(() => {})
        if (subjectId) await subjectRepository.remove(subjectId).catch(() => {})
    })

    it("create deve inserir vínculo", async () => {
        // ACT: usa os dados preparados pelo beforeEach
        const result = await psRepository.create({ professorId, subjectId })

        // ASSERT: o vínculo foi criado com os IDs corretos?
        expect(result).toBeDefined()
        expect(result.professorId).toBe(professorId)
        expect(result.subjectId).toBe(subjectId)

        // CLEANUP: remove o vínculo que criamos
        await psRepository.remove(result.id)
    })

    it("findAll deve retornar array", async () => {
        const result = await psRepository.findAll()
        expect(Array.isArray(result)).toBe(true)
    })

    it("findById deve retornar undefined para ID inexistente", async () => {
        const result = await psRepository.findById("00000000-0000-0000-0000-000000000000")
        expect(result).toBeUndefined()
    })

    it("findAll com filtro professorId", async () => {
        // ARRANGE: cria um vínculo específico
        const link = await psRepository.create({ professorId, subjectId })

        // ACT: busca com filtro
        const result = await psRepository.findAll({ professorId })

        // ASSERT: o vínculo que criamos está nos resultados?
        // .some() testa se PELO MENOS UM item do array satisfaz
        // a condição.
        expect(result.some(r => r.id === link.id)).toBe(true)

        // CLEANUP
        await psRepository.remove(link.id)
    })

    it("remove deve deletar o vínculo", async () => {
        // ARRANGE
        const created = await psRepository.create({ professorId, subjectId })

        // ACT
        const removed = await psRepository.remove(created.id)

        // ASSERT: o vínculo foi removido?
        expect(removed.id).toBe(created.id)

        // Verificação dupla: o findById agora deve retornar undefined
        const found = await psRepository.findById(created.id)
        expect(found).toBeUndefined()
    })

    it("findAverage deve retornar estrutura correta para ID inexistente", async () => {
        // ACT: calcula média de um vínculo que NÃO existe
        const result = await psRepository.findAverage("00000000-0000-0000-0000-000000000000")

        // ASSERT: mesmo sem avaliações, a estrutura deve vir
        // com average = 0 e count = 0 (não pode lançar erro)
        expect(result).toHaveProperty("professorSubjectId")
        expect(result).toHaveProperty("average")
        expect(result).toHaveProperty("count")
        expect(result.count).toBe(0)
    })
})
