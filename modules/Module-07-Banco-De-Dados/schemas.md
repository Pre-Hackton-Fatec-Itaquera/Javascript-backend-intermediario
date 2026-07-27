# Schemas do Banco de Dados

Agora que conseguimos nos conectar ao PostgreSQL, precisamos definir quais tabelas existirão no banco.

Neste projeto utilizaremos a seguinte estrutura:

```text
db

schemas

index.ts
professor.ts
subjects.ts
ratings.ts
professorSubject.ts
```

Cada arquivo representa uma tabela do PostgreSQL.

---

## O que é um Schema?

Podemos pensar em um schema como uma representação TypeScript de uma tabela do banco.

Por exemplo:

```ts
export const professor = pgTable("professor", {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull()
});
```

Esse código representa:

```sql
CREATE TABLE professor(
    id UUID PRIMARY KEY,
    name TEXT NOT NULL
);
```

---

## Principais tipos utilizados

Neste projeto utilizaremos:

```ts
text()
```

Campos de texto.

---

```ts
uuid()
```

Identificadores únicos.

---

```ts
real()
```

Números decimais.

---

```ts
date()
```

Datas.

---

## Principais modificadores

```ts
primaryKey()
```

Define a chave primária da tabela.

---

```ts
notNull()
```

Define que o campo é obrigatório.

---

```ts
defaultRandom()
```

Gera automaticamente um UUID.

---

## O arquivo index.ts

Além dos schemas individuais, utilizamos um arquivo responsável por centralizar todas as tabelas.

Exemplo:

```ts
export const schema = {
    professor,
    professorSubject,
    ratings,
    subjects
}
```

Isso nos permite importar todas as entidades do banco através de um único objeto.

Exemplo:

```ts
import { schema } from "#db/schemas";

schema.professor
schema.subjects
```

Essa abordagem deixa os imports mais limpos e facilita a manutenção do projeto.

---

## Material complementar

Tipos disponíveis no PostgreSQL:

https://orm.drizzle.team/docs/column-types/pg