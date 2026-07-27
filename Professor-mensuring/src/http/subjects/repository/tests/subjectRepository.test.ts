// 🧪 TESTES (vitest)
//
// Testamos o subjectRepository contra o banco real (PostgreSQL).
// Cada teste segue o padrão AAA: Arrange → Act → Assert, seguido
// de cleanup para não deixar lixo no banco.
//
// Por que NÃO usar mocks?
//   Se mockarmos o banco, o teste passa mas o SQL gerado pode
//   estar errado. Testes de integração são mais lentos, mas
//   detectam: erros de sintaxe SQL, violações de constraint,
//   nomes de coluna errados, etc.

import { describe, it, expect } from "vitest"
import * as subjectRepository from "#http/subjects/repository/subjectRepository.ts"

describe("SubjectRepository", () => {
    it("findAll deve retornar um array", async () => {
        const result = await subjectRepository.findAll()
        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
    })

    it("findById deve retornar undefined para ID inexistente", async () => {
        const result = await subjectRepository.findById("00000000-0000-0000-0000-000000000000")
        expect(result).toBeUndefined()
    })

    it("create deve inserir e retornar o registro com id", async () => {
        // ARRANGE + ACT: cria uma matéria
        const result = await subjectRepository.create({ name: "Matéria Teste", semester: 1 })

        // ASSERT: verifica se o banco gerou o id e salvou os campos
        expect(result).toBeDefined()
        expect(result.id).toBeDefined()
        expect(result.name).toBe("Matéria Teste")
        expect(result.semester).toBe(1)

        // CLEANUP: remove para não afetar outros testes
        await subjectRepository.remove(result.id)
    })

    it("update deve modificar campos", async () => {
        // ARRANGE: cria uma matéria com dados iniciais
        const created = await subjectRepository.create({ name: "Original", semester: 1 })

        // ACT: altera nome e semestre
        const updated = await subjectRepository.update(created.id, { name: "Modificado", semester: 2 })

        // ASSERT: os campos foram alterados?
        expect(updated.name).toBe("Modificado")
        expect(updated.semester).toBe(2)

        // CLEANUP
        await subjectRepository.remove(created.id)
    })

    it("remove deve deletar o registro", async () => {
        // ARRANGE
        const created = await subjectRepository.create({ name: "Será Removido", semester: 1 })

        // ACT
        const removed = await subjectRepository.remove(created.id)

        // ASSERT: o DELETE .returning() devolve o registro removido
        expect(removed.id).toBe(created.id)

        // Verifica que realmente não existe mais
        const found = await subjectRepository.findById(created.id)
        expect(found).toBeUndefined()
    })
})
