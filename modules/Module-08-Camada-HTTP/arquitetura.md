# Arquitetura da Feature

## Estrutura utilizada no projeto

```text
professor

├── repository
│   └── professorRepository.ts
│
├── route
│   └── ProfessorRoutes.ts
│
├── schemas
│   └── ProfessorSchema.ts
│
├── services
│   └── ProfessorServices.ts
│
└── professor.http
```

Cada pasta possui uma responsabilidade específica, tornando a aplicação mais organizada e fácil de manter.

---

## O que é uma Feature?

Uma Feature representa uma funcionalidade da aplicação.

Em vez de organizar o projeto por tipo de arquivo (controllers, services, repositories, etc.), agrupamos tudo o que pertence ao mesmo domínio.

Exemplo:

- Professor
- Aluno
- Curso
- Disciplina

Cada uma possui suas próprias rotas, services, repositories, schemas e arquivos de teste.

Essa abordagem reduz o acoplamento e facilita a evolução do sistema.

---

## Repository

O Repository é responsável exclusivamente pela comunicação com o banco de dados.

Suas responsabilidades incluem:

- Buscar registros.
- Inserir dados.
- Atualizar informações.
- Remover registros.

Exemplo:

```ts
export const findAll = async () => {
    return await db
        .select()
        .from(schema.professor)
}
```

O Repository não deve conter regras de negócio.

---

## Service

O Service concentra as regras de negócio da aplicação.

Nele realizamos:

- Validações adicionais.
- Tratamento de erros.
- Processamentos.
- Tomada de decisões.

Exemplo:

```ts
const professor =
    await professorRepository.findById(id)

if (!professor) {
    throw new NotFoundError(
        "Professor não encontrado."
    )
}
```

Sempre que surgir uma regra da aplicação, provavelmente ela pertence ao Service.

---

## Schemas

Os Schemas definem os contratos da aplicação utilizando o Zod.

Eles são utilizados para:

- Validar requisições.
- Validar respostas.
- Gerar tipagem automática.
- Gerar documentação no Swagger.

Exemplo:

```ts
export const professorSchema = z.object({
    id: z.string(),
    name: z.string().min(3)
})
```

Escrevemos o contrato apenas uma vez e o reutilizamos em toda a aplicação.

---

## Arquivos `.http`

Arquivos `.http` permitem testar rapidamente os endpoints da API.

Exemplo:

```http
GET http://localhost:3333/professor
```

Suas vantagens incluem:

- Não depender do Postman.
- Versionar testes junto ao projeto.
- Facilitar o compartilhamento entre a equipe.

---

## Fluxo da aplicação

```text
Cliente

↓

Route

↓

Schema (Zod)

↓

Service

↓

Repository

↓

Banco de dados

↓

Repository

↓

Service

↓

Route

↓

Resposta
```

Cada camada possui uma única responsabilidade, facilitando manutenção, testes e evolução da aplicação.

---

## Qual padrão estamos utilizando?

A arquitetura utilizada combina três padrões bastante conhecidos:

- Feature Based Architecture
- Service Layer Pattern
- Repository Pattern

Essa separação torna o código mais organizado, reutilizável e escalável.