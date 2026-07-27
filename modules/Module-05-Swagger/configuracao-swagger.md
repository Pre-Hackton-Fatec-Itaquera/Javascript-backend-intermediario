# Módulo 05 - Swagger

## Objetivo do módulo

Neste módulo iremos aprender:

- O que é o Swagger.
- O que é o OpenAPI.
- Como documentar automaticamente uma API.
- Como integrar Swagger, Fastify e Zod.

---

## O que é o Swagger?

Uma API possui diversas informações importantes, como:

- Rotas.
- Parâmetros.
- Métodos HTTP.
- Tipos de dados.
- Respostas possíveis.
- Códigos de status.

Sem uma documentação adequada, utilizar uma API pode ser bastante complicado.

O Swagger é uma ferramenta utilizada para gerar documentações interativas para APIs REST.

Por exemplo:

```text
GET /professor

POST /ratings

DELETE /subjects/:id
```

Além da documentação, ele também permite realizar testes diretamente pelo navegador.

---

## O que é OpenAPI?

O Swagger utiliza uma especificação chamada:

```text
OpenAPI Specification
```

Ela define um padrão para descrever APIs REST.

Em outras palavras, o OpenAPI funciona como uma linguagem universal para documentação de APIs.

Isso permite que ferramentas consigam entender automaticamente:

- Rotas.
- Schemas.
- Respostas.
- Parâmetros.

---

## Por que utilizar o Swagger?

Imagine uma API contendo:

```text
40 rotas.
```

Sem documentação, qualquer desenvolvedor precisaria:

- Ler o código.
- Descobrir quais dados enviar.
- Descobrir quais respostas esperar.

Com o Swagger, todas essas informações ficam disponíveis automaticamente.

Algumas vantagens:

- Fácil de utilizar.
- Interface gráfica.
- Permite testes.
- Excelente para equipes.
- Geração automática da documentação.

---

## Instalando os pacotes

Utilizamos dois plugins oficiais do Fastify:

```bash
npm i @fastify/swagger

npm i @fastify/swagger-ui
```

O primeiro é responsável por gerar a documentação.

O segundo disponibiliza uma interface gráfica acessível pelo navegador.

---

## Registrando o Swagger

A configuração básica utilizada no projeto é:

```ts
server.register(fastifySwagger, {
    openapi: {
        info: {
            title: "Hackathon Fatec Itaquera",
            version: "0.0.0.1",
            description:
                "Projeto desenvolvido para o Pré-Hackathon."
        }
    }
});
```

Essas informações serão exibidas na documentação.

---

## Integrando Fastify e Zod

Nosso projeto utiliza:

```ts
fastify-type-provider-zod
```

Esse pacote nos permite escrever apenas os schemas utilizando o Zod.

Exemplo:

```ts
z.object({
    name: z.string()
});
```

A partir desses schemas conseguimos:

- Validar dados.
- Inferir tipos.
- Gerar documentação automaticamente.

---

## O que é o jsonSchemaTransform?

Observe a seguinte configuração:

```ts
transform: jsonSchemaTransform
```

Ela é responsável por converter os schemas do Zod para o padrão esperado pelo OpenAPI.

Fluxo simplificado:

```text
Zod
↓

JSON Schema
↓

OpenAPI

↓

Swagger UI
```

Sem essa transformação, o Swagger não conseguiria compreender os schemas escritos utilizando o Zod.

---

## Swagger UI

Após configurar o Swagger, precisamos disponibilizar sua interface gráfica.

```ts
server.register(
    fastifySwaggerUi,
    {
        routePrefix: "/docs"
    }
);
```

Isso significa que a documentação ficará disponível em:

```text
http://localhost:3333/docs
```

---

## Vantagens do Swagger

Durante o desenvolvimento você poderá:

- Visualizar todas as rotas.
- Testar endpoints.
- Verificar schemas.
- Consultar códigos de resposta.
- Compartilhar a documentação com outras pessoas.

Tudo isso sem a necessidade de ferramentas adicionais.

---

## O Swagger substitui o Postman?

Não necessariamente.

Ferramentas como:

- Postman
- Insomnia
- REST Client

continuam sendo extremamente úteis.

No entanto, para APIs pequenas e médias, o Swagger costuma ser suficiente para grande parte dos testes.

---

## Materiais complementares

### Documentações

Swagger

https://swagger.io/

OpenAPI

https://www.openapis.org/

Fastify Swagger

https://github.com/fastify/fastify-swagger

Swagger UI

https://github.com/fastify/fastify-swagger-ui

---

## Resumo

Neste módulo aprendemos:

- O que é o Swagger.
- O que é o OpenAPI.
- Como documentar APIs automaticamente.
- Como integrar Fastify, Zod e Swagger.
- Como disponibilizar uma interface gráfica da documentação.

Nos próximos módulos começaremos a construir as rotas da nossa aplicação e utilizar o Swagger na prática.