# Conectando ao PostgreSQL

Após configurarmos o Drizzle, precisamos criar a conexão da aplicação com o banco de dados.

Arquivo:

```text
src/db/connection.ts
```

Código:

```ts
import { env } from "#lib/env";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionURL = env.DATABASE_URL;

const client = postgres(connectionURL);

export const db = drizzle(client);
```

---

## O que é uma conexão?

Sempre que nossa aplicação precisar:

- Buscar dados
- Inserir dados
- Atualizar dados
- Remover dados

ela precisará conversar com o PostgreSQL.

Essa comunicação acontece através da conexão criada neste arquivo.

---

## DATABASE_URL

A conexão é realizada através de uma Connection String.

Exemplo:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/professor-mensuring"
```

Sua estrutura é:

```text
postgres://usuario:senha@host:porta/database
```

---

## O pacote postgres-js

O Drizzle não realiza a conexão diretamente com o banco.

Quem faz isso é o pacote:

```bash
postgres
```

Ele é responsável por:

- Abrir a conexão.
- Enviar consultas SQL.
- Receber os resultados.

Criamos o client através da URL:

```ts
const client = postgres(connectionURL);
```

---

## Criando a instância do Drizzle

Após criar o client, basta entregá-lo ao Drizzle:

```ts
export const db = drizzle(client);
```

Esse objeto será utilizado em toda a aplicação.

Por exemplo:

```ts
db.select();
db.insert();
db.update();
db.delete();
```

Sempre que você encontrar:

```ts
db
```

significa que estamos utilizando a conexão criada neste arquivo.

---

## Material complementar

Postgres JS:

https://github.com/porsager/postgres

Documentação do Drizzle:

https://orm.drizzle.team/docs/get-started-postgresql