# Ratings de Professores — Design

## Objetivo

Permitir que alunos avaliem professores anonimamente com notas de 1 a 5, associadas a uma matéria específica. O cálculo da média é feito por consulta (não materializado), agregando por professor + matéria.

## Escopo

- Alunos são anônimos (sem autenticação)
- Nota: inteiro de 1 a 5
- Comentário opcional com limite de 255 caracteres
- Cada avaliação vincula um professor a uma matéria via tabela intermediária

## Tabelas

### `professor` (modificada)

| Coluna | Tipo | Notas |
|---|---|---|
| id | uuid PK | defaultRandom — inalterado |
| name | text NOT NULL | inalterado |

**Removido:** `subjectId` (coluna + FK), `averageRating` (coluna)

### `subjects` (inalterada)

| Coluna | Tipo | Notas |
|---|---|---|
| id | uuid PK | defaultRandom |
| name | text NOT NULL | |
| semester | real NOT NULL | |
| createdAt | timestamp NOT NULL | defaultNow |

### `professor_subject` (nova)

| Coluna | Tipo | Restrições |
|---|---|---|
| id | uuid PK | defaultRandom |
| professorId | uuid NOT NULL | FK → professor.id, onDelete cascade |
| subjectId | uuid NOT NULL | FK → subjects.id, onDelete cascade |
| | | UNIQUE (professorId, subjectId) |

### `ratings` (nova)

| Coluna | Tipo | Restrições |
|---|---|---|
| id | uuid PK | defaultRandom |
| value | integer NOT NULL | CHECK (value >= 1 AND value <= 5) |
| comment | text | max 255 chars, nullable |
| createdAt | timestamp NOT NULL | defaultNow |
| professorSubjectId | uuid NOT NULL | FK → professor_subject.id, onDelete cascade |

## Arquivos afetados

### Criar
- `src/db/schemas/ratings.ts` — definição da tabela `ratings`
- `src/db/schemas/professorSubject.ts` — definição da tabela `professor_subject`

### Modificar
- `src/db/schemas/professor.ts` — remover `subjectId` e `averageRating`
- `src/db/schemas/index.ts` — adicionar `professorSubject` e `ratings` ao export
- `src/http/professor/schemas/ProfessorSchema.ts` — remover `subjectId` e `averageRating`
- `src/http/professor/repository/professorRepository.ts` — ajustar query se necessário
- Migrations: gerar nova migration com drizzle-kit

### Nenhum arquivo é removido — apenas colunas em tabelas existentes.
