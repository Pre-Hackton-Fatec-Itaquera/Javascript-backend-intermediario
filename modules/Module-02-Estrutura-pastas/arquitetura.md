# Módulo 02 - Arquitetura do projeto

## Objetivo do módulo

Antes de começarmos a desenvolver a aplicação, precisamos decidir como iremos organizar o código.

Uma das dúvidas mais comuns de quem está estudando backend é:

> Qual a melhor arquitetura para um projeto?

A resposta é simples:

> Não existe uma arquitetura perfeita.

A maioria dos projetos reais mistura conceitos de diferentes arquiteturas para atender às necessidades do sistema.

Neste projeto utilizaremos uma arquitetura híbrida, inspirada principalmente na organização baseada em Features.

---

## O que significa "baseada em Features"?

Uma Feature representa uma funcionalidade do sistema.

No nosso caso, algumas Features são:

- Professor
- Subjects
- Ratings
- Professor Subject

Cada Feature possui sua própria organização interna contendo:

- Rotas
- Services
- Repository
- Schemas
- Testes

Por exemplo:

```text
professor/

    repository/
    route/
    schemas/
    services/
    tests/

    professor.http
```

Dessa forma, tudo que pertence ao domínio "Professor" fica agrupado em um único local.

---

## Organização completa do projeto

Nossa estrutura será a seguinte:

```text
src/

    db/
        migrations/
        schemas/
        connection.ts
        seed.ts

    errors/

    handlers/

    http/

        professor/
            repository/
            route/
            schemas/
            services/
            tests/

            professor.http

        professor-subject/

        ratings/

        subjects/

        health.ts

    lib/

    test/
        globalRoutes.http

    server.ts
```

---

## Entendendo cada diretório

### db/

Responsável por toda a infraestrutura do banco de dados.

Contém:

- Migrations
- Schemas das tabelas
- Conexão com o PostgreSQL
- Seed do banco

---

### errors/

Contém os erros personalizados da aplicação.

Exemplos:

```text
NotFoundError

BadRequestError

UnauthorizedError
```

Centralizar os erros facilita bastante o tratamento das exceções do projeto.

---

### handlers/

Responsável por funcionalidades globais da aplicação.

Neste projeto utilizaremos essa pasta para armazenar:

```text
Error Handler
```

Ela será responsável por interceptar e tratar todos os erros lançados pela aplicação.

---

### http/

Aqui ficam todas as funcionalidades do sistema.

Cada pasta representa uma Feature da aplicação.

Exemplo:

```text
Professor
Subjects
Ratings
Professor Subject
```

Essa é a principal pasta do projeto.

---

### repository/

Responsável por conversar diretamente com o banco de dados.

Exemplos:

```text
SELECT

INSERT

UPDATE

DELETE
```

O Repository NÃO possui regras de negócio.

---

### services/

Responsável pela regra de negócio da aplicação.

Exemplos:

- Verificar se um professor existe.
- Calcular médias.
- Validar determinadas regras do sistema.
- Orquestrar chamadas entre diferentes entidades.

---

### route/

Responsável por:

- Registrar as rotas.
- Definir schemas de entrada e saída.
- Receber requisições.
- Retornar respostas.

Exemplo:

```text
GET /professor

POST /professor
```

---

### schemas/

Responsável pelos Schemas do Zod.

São utilizados para:

- Validar dados.
- Inferir tipos automaticamente.
- Definir contratos da API.

---

### tests/

Responsável pelos testes unitários relacionados à Feature.

Exemplo:

```text
findProfessor.test.ts
```

Uma das vantagens dessa abordagem é manter os testes próximos do código que está sendo testado.

---

### Arquivos .http

Cada Feature possui um arquivo HTTP para testes manuais.

Exemplo:

```text
professor.http
```

Esses arquivos são utilizados juntamente com a extensão REST Client do VS Code.

Isso permite testar a API sem a necessidade de ferramentas externas como:

- Postman
- Insomnia

Além disso, os testes ficam versionados juntamente com o código do projeto.

---

### test/

A pasta test possui arquivos HTTP globais da aplicação.

Exemplo:

```text
globalRoutes.http
```

Ela é utilizada para endpoints que não pertencem necessariamente a uma Feature específica.

---

### lib/

Responsável por armazenar utilitários e configurações compartilhadas do projeto.

Por exemplo:

```text
env.ts
```

---

### server.ts

É o ponto de entrada da aplicação.

Sua responsabilidade é:

- Criar o servidor Fastify.
- Registrar plugins.
- Registrar rotas.
- Configurar Swagger.
- Configurar CORS.
- Configurar Error Handler.
- Inicializar a aplicação.

---

## Por que escolhemos essa organização?

Essa arquitetura foi escolhida porque ela oferece um excelente equilíbrio entre:

- Simplicidade.
- Escalabilidade.
- Organização.
- Facilidade de manutenção.
- Facilidade de aprendizado.

Além disso, ela permite que novas funcionalidades sejam adicionadas ao projeto sem grandes mudanças na estrutura existente.

---

## Uma observação importante

Não existe problema em misturar diferentes padrões arquiteturais.

Na prática, muitos projetos profissionais utilizam arquiteturas híbridas.

Mais importante do que seguir um padrão famoso é entender:

> "Qual problema essa organização está resolvendo?"

Sempre questione se determinada decisão arquitetural realmente faz sentido para o tamanho e os objetivos do projeto.

---

## Resumo

Neste módulo aprendemos:

- O que é uma arquitetura baseada em Features.
- Como o projeto está organizado.
- A responsabilidade de cada diretório.
- Por que utilizamos uma arquitetura híbrida.
- Como separar responsabilidades dentro de uma aplicação backend.

No próximo módulo começaremos a configurar o nosso servidor utilizando o Fastify.