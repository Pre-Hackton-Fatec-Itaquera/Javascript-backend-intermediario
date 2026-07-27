# Finalização do CRUD — Design

## Objetivo

Completar as operações CRUD de todas as tabelas do banco (`professor`, `subjects`, `professor_subject`, `ratings`) seguindo o padrão de camadas do professor, com endpoints de consulta e filtros, testes unitários, e comentários didáticos em todo o código.

## Abordagem

Uma pasta por entidade em `src/http/`, cada uma com route/service/schema/repository/tests. Sem abstrações genéricas — a repetição do padrão é intencional para fins didáticos.

## Endpoints

### Professor (expandir — GET /professor já existe)

| Método | Rota | Descrição |
|---|---|---|
| GET | /professor | Lista todos |
| GET | /professor/:id | Busca por ID |
| POST | /professor | Cria |
| PUT | /professor/:id | Atualiza |
| DELETE | /professor/:id | Remove |

### Subjects (nova)

| Método | Rota | Descrição |
|---|---|---|
| GET | /subjects | Lista todos |
| GET | /subjects/:id | Busca por ID |
| POST | /subjects | Cria |
| PUT | /subjects/:id | Atualiza |
| DELETE | /subjects/:id | Remove |

### Professor-Subject (nova — sem PUT)

| Método | Rota | Descrição |
|---|---|---|
| GET | /professor-subject | Lista vínculos. Filtros: `?professorId=`, `?subjectId=` |
| GET | /professor-subject/:id | Busca por ID |
| POST | /professor-subject | Cria vínculo |
| DELETE | /professor-subject/:id | Remove vínculo |
| GET | /professor-subject/:id/average | Média das avaliações + contagem |

### Ratings (nova)

| Método | Rota | Descrição |
|---|---|---|
| GET | /ratings | Lista. Filtro: `?professorSubjectId=` |
| GET | /ratings/:id | Busca por ID |
| POST | /ratings | Cria avaliação |
| PUT | /ratings/:id | Atualiza (ex: censurar comentário via IA) |
| DELETE | /ratings/:id | Remove |

## Schemas Zod

Um schema base por entidade. As rotas usam `.omit()`, `.pick()`, `.partial()` para derivar schemas de request sem duplicar campos.

### Professor

```typescript
// ProfessorSchema.ts — schema base
export const professorSchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Insira ao menos um nome com 3 caracteres"),
})

// Na rota:
//   POST: professorSchema.omit({ id: true })
//   PUT:  professorSchema.omit({ id: true }).partial()
//   GET (response 200 como array): z.array(professorSchema)
```

### Subjects

```typescript
// SubjectSchema.ts
export const subjectSchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Insira ao menos um nome com 3 caracteres"),
    semester: z.number(),
    createdAt: z.string(),
})

// Na rota:
//   POST: subjectSchema.omit({ id: true, createdAt: true })
//   PUT:  subjectSchema.omit({ id: true, createdAt: true }).partial()
//   GET /:id (response): subjectSchema
//   GET (list response): z.array(subjectSchema)
```

### Professor-Subject

```typescript
// ProfessorSubjectSchema.ts
export const professorSubjectSchema = z.object({
    id: z.string(),
    professorId: z.string(),
    subjectId: z.string(),
})

export const averageSchema = z.object({
    professorSubjectId: z.string(),
    average: z.number(),
    count: z.number(),
})

// Na rota:
//   POST: professorSubjectSchema.omit({ id: true })
//   GET /:id/average (response): averageSchema
```

### Ratings

```typescript
// RatingSchema.ts
export const ratingSchema = z.object({
    id: z.string(),
    value: z.number().min(1).max(5),
    comment: z.string().max(255).nullable(),
    createdAt: z.string(),
    professorSubjectId: z.string(),
})

// Na rota:
//   POST: ratingSchema.omit({ id: true, createdAt: true })
//   PUT:  ratingSchema.omit({ id: true, createdAt: true }).partial()
//   GET /:id (response): ratingSchema
```

## Estrutura de pastas

```
src/
├── db/schemas/               (já existe — inalterado)
│   ├── index.ts
│   ├── professor.ts
│   ├── professorSubject.ts
│   ├── ratings.ts
│   └── subject.ts
├── http/
│   ├── health.ts
│   ├── professor/             (já existe — expandir)
│   │   ├── route/ProfessorRoutes.ts
│   │   ├── services/ProfessorServices.ts
│   │   ├── schemas/ProfessorSchema.ts
│   │   ├── repository/professorRepository.ts
│   │   └── repository/tests/
│   ├── subjects/              (nova)
│   │   ├── route/SubjectRoutes.ts
│   │   ├── services/SubjectServices.ts
│   │   ├── schemas/SubjectSchema.ts
│   │   ├── repository/subjectRepository.ts
│   │   └── repository/tests/
│   ├── professor-subject/     (nova)
│   │   ├── route/ProfessorSubjectRoutes.ts
│   │   ├── services/ProfessorSubjectServices.ts
│   │   ├── schemas/ProfessorSubjectSchema.ts
│   │   ├── repository/professorSubjectRepository.ts
│   │   └── repository/tests/
│   └── ratings/               (nova)
│       ├── route/RatingRoutes.ts
│       ├── services/RatingServices.ts
│       ├── schemas/RatingSchema.ts
│       ├── repository/ratingRepository.ts
│       └── repository/tests/
└── server.ts                  (registrar novos plugins)
```

## Tratamento de erros

Usar as classes existentes em `#errors/`:
- `NotFoundError` — registro não encontrado por ID
- `ConflictError` — violação de unique (ex: vínculo professor-subject duplicado)
- `BadRequestError` — validações de negócio (ex: nota fora de 1-5)

## Testes

Por repositório, testes de integração contra o banco real:
- Listagem retorna array
- Busca por ID retorna o registro
- Busca por ID inexistente (testar que o repository propaga o erro)
- Criação insere e retorna com id
- Atualização modifica campos
- Remoção deleta e registro some da listagem
- Filtros retornam apenas registros que correspondem
- Média retorna `{ average, count }` correto

## Comentários didáticos

Todos os arquivos terão comentários explicando o papel de cada camada, por que ela existe, e como as peças se conectam — seguindo o estilo já iniciado em `errorHandler.ts`, `apiError.ts` e `server.ts`.
