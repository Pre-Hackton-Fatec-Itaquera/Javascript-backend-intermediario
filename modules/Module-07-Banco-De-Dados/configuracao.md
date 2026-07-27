# Configurando o Drizzle ORM

Antes de começar, precisamos entender dois conceitos importantes.

## O que é um ORM?

ORM significa Object Relational Mapper.

Em outras palavras, ele é responsável por transformar consultas SQL em código JavaScript/TypeScript.

Sem um ORM, precisaríamos escrever SQL manualmente para praticamente todas as operações do sistema.

Por exemplo:

```sql
SELECT * FROM professor;
```

Com o Drizzle ORM podemos fazer:

```ts
db.select().from(schema.professor);
```

Além de deixar o código mais legível, também ganhamos:

- Autocomplete.
- Tipagem estática.
- Melhor manutenção do projeto.
- Maior produtividade.

---

## Drizzle ORM vs Drizzle Kit

Uma dúvida bastante comum é:

> Por que instalamos dois pacotes diferentes?

Neste projeto utilizaremos:

```bash
drizzle-orm
```

Responsável por conversar com o banco de dados durante a execução da aplicação.

E:

```bash
drizzle-kit
```

Responsável por gerar migrations, sincronizar os schemas e abrir o Drizzle Studio.

Em resumo:

| Pacote | Responsabilidade |
|-------|-------|
| drizzle-orm | Consultas ao banco |
| drizzle-kit | Ferramentas de desenvolvimento |

---

## Arquivo drizzle.config.ts

Todo projeto Drizzle possui um arquivo responsável por informar:

- Qual banco estamos utilizando.
- Onde estão os schemas.
- Onde as migrations serão geradas.
- Como acessar o banco.

Exemplo:

```ts
import { env } from "#lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    casing: "camelCase",
    schema: "./src/db/schemas/**/*.ts",
    out: "./src/db/migrations",
    dbCredentials: {
        url: env.DATABASE_URL
    }
})
```

---

## Entendendo cada propriedade

### dialect

Define qual banco de dados estamos utilizando.

```ts
dialect: "postgresql"
```

O Drizzle também suporta outros bancos como:

- SQLite
- MySQL
- Turso
- SingleStore

Neste projeto utilizaremos PostgreSQL.

---

### schema

Define onde estão os arquivos responsáveis por representar nossas tabelas.

```ts
schema: "./src/db/schemas/**/*.ts"
```

Todo arquivo TypeScript presente dentro da pasta schemas será utilizado pelo Drizzle.

---

### out

Define onde as migrations serão geradas.

```ts
out: "./src/db/migrations"
```

Esses arquivos são escritos em SQL e serão utilizados para criar ou modificar as tabelas do banco.

---

### dbCredentials

Responsável por informar como acessar o banco de dados.

```ts
dbCredentials: {
    url: env.DATABASE_URL
}
```

Essa URL será configurada através do arquivo .env.

---

## Material complementar

Documentação oficial:

https://orm.drizzle.team/

Drizzle Kit:

https://orm.drizzle.team/docs/kit-overview