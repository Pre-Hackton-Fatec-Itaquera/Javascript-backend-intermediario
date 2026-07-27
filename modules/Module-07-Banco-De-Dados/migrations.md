# Migrations e Drizzle Studio

Após criar nossos schemas, ainda precisamos criar as tabelas no PostgreSQL.

Para isso utilizaremos as migrations do Drizzle.

---

## O que é uma Migration?

Uma migration é um arquivo responsável por representar alterações realizadas no banco de dados.

Sempre que:

- Criamos uma tabela.
- Alteramos uma coluna.
- Adicionamos um relacionamento.
- Removemos uma propriedade.

precisamos gerar uma nova migration.

---

## Gerando as migrations

Execute:

```bash
npm run db:generate
```

Esse comando irá:

```text
Schemas

↓

Drizzle Kit

↓

Migration SQL
```

Os arquivos SQL serão armazenados em:

```text
src/db/migrations
```

---

## Executando as migrations

Após gerar os arquivos SQL, precisamos aplicá-los ao PostgreSQL.

Execute:

```bash
npm run db:migrate
```

Fluxo completo:

```text
Schemas

↓

Generate

↓

Migration SQL

↓

Migrate

↓

PostgreSQL
```

---

## Drizzle Studio

Também podemos visualizar nosso banco de dados utilizando uma interface gráfica.

Execute:

```bash
npm run db:studio
```

O Drizzle Studio permite:

- Visualizar tabelas.
- Inserir registros.
- Editar registros.
- Remover registros.
- Explorar relacionamentos.

É uma excelente ferramenta para desenvolvimento e testes.

---

## Fluxo completo do módulo

```text
Criar Schema

↓

Gerar Migration

↓

Executar Migration

↓

Abrir o Drizzle Studio

↓

Banco de dados pronto para utilização
```

---

## Material complementar

Migrations:

https://orm.drizzle.team/docs/migrations

Drizzle Studio:

https://orm.drizzle.team/drizzle-studio/overview