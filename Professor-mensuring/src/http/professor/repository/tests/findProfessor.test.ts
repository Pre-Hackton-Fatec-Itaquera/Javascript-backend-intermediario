// 🧪 TESTES (vitest)
//
// Este arquivo testa o professorRepository CONTRA O BANCO DE DADOS REAL.
// Diferente de testes unitários "mockados" que isolam o banco,
// aqui preferimos testes de integração que garantem que o SQL
// gerado pelo Drizzle realmente funciona no PostgreSQL.
//
// Por que testar contra o banco real?
//   - O Drizzle gera SQL dinamicamente. Um `eq()` errado vira
//     um WHERE silenciosamente errado que só aparece em produção.
//   - Constraints (unique, FK, check) só são validadas pelo banco.
//   - Falsos positivos de mocks são piores que testes lentos.
//
// Padrão AAA (Arrange-Act-Assert):
//   1. ARRANGE: prepara os dados (cria registros)
//   2. ACT: executa a operação sendo testada
//   3. ASSERT: verifica se o resultado é o esperado
//   4. CLEANUP: remove os dados criados (não polui o banco)

import { describe, it, expect } from "vitest"
import * as professorRepository from "#http/professor/repository/professorRepository.ts"

// describe agrupa testes relacionados. No relatório do vitest,
// aparece como "ProfessorRepository > findAll deve retornar um array".
// it é cada teste individual.
describe("ProfessorRepository", () => {
    it("findAll deve retornar um array", async () => {
        // ACT: chama o repository
        const result = await professorRepository.findAll()

        // ASSERT: verifica se o resultado é um array
        // O `expect` do vitest usa matchers encadeados:
        //   .toBeDefined()   — não é null nem undefined
        //   .toBe(true)      — igualdade estrita (===)
        //   .toEqual()        — igualdade profunda (objetos)
        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
    })

    it("findById deve retornar undefined para ID inexistente", async () => {
        // UUID de zero é um ID que NUNCA vai existir no banco.
        // Isso testa o cenário de "registro não encontrado".
        const result = await professorRepository.findById("00000000-0000-0000-0000-000000000000")

        // .toBeUndefined() verifica se o repository retornou
        // undefined em vez de lançar um erro.
        // O service é quem decide se isso vira 404 ou não.
        expect(result).toBeUndefined()
    })

    it("create deve inserir e retornar o registro com id", async () => {
        // ARRANGE: define os dados
        const data = { name: "Professor Teste" }

        // ACT: insere no banco
        const result = await professorRepository.create(data)

        // ASSERT: verifica se o insert funcionou
        expect(result).toBeDefined()
        expect(result.id).toBeDefined()       // uuid foi gerado?
        expect(result.name).toBe("Professor Teste")

        // CLEANUP: remove o registro que criamos
        await professorRepository.remove(result.id)
    })

    it("update deve modificar o nome", async () => {
        // ARRANGE: cria um professor para depois alterar
        const created = await professorRepository.create({ name: "Nome Antigo" })

        // ACT: atualiza o nome
        const updated = await professorRepository.update(created.id, { name: "Nome Novo" })

        // ASSERT: verifica se o nome mudou
        expect(updated.name).toBe("Nome Novo")

        // CLEANUP
        await professorRepository.remove(created.id)
    })

    it("remove deve deletar o registro", async () => {
        // ARRANGE
        const created = await professorRepository.create({ name: "Será Removido" })

        // ACT: deleta
        const removed = await professorRepository.remove(created.id)

        // ASSERT: verifica se o registro deletado foi o correto
        // e se realmente sumiu do banco
        expect(removed.id).toBe(created.id)
        const found = await professorRepository.findById(created.id)
        expect(found).toBeUndefined()          // não deveria mais existir
    })
})
