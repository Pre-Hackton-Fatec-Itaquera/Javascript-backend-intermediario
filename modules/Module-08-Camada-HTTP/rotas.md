# Rotas HTTP

## O que é HTTP?

HTTP é o protocolo utilizado para comunicação entre clientes e servidores.

Sempre que um cliente realiza uma requisição para uma API, ele informa qual ação deseja executar através de um método HTTP.

---

## Métodos HTTP

Os principais métodos utilizados em APIs REST são:

| Método | Objetivo |
| ------- | -------- |
| GET | Buscar dados |
| POST | Criar recursos |
| PUT | Atualizar recursos |
| PATCH | Atualizar parcialmente |
| DELETE | Remover recursos |

Exemplos:

```http
GET /professor
```

```http
POST /professor
```

```http
PUT /professor/:id
```

```http
DELETE /professor/:id
```

---

## Criando nossas rotas

No projeto utilizamos um prefixo para centralizar o caminho da feature.

```ts
const prefix = "/professor"
```

Assim definimos as rotas:

```text
GET    /professor

GET    /professor/:id

POST   /professor

PUT    /professor/:id

DELETE /professor/:id
```

Caso seja necessário alterar o prefixo futuramente, basta modificar um único local.

---

## GET

Utilizado para consultar recursos.

Exemplos:

```ts
server.get(prefix, ...)
```

```ts
server.get(`${prefix}/:id`, ...)
```

O parâmetro `:id` representa um valor enviado na URL.

Exemplo:

```text
/professor/123
```

---

## POST

Utilizado para criar novos recursos.

Como o identificador é gerado pelo banco de dados, normalmente utilizamos:

```ts
professorSchema.omit({
    id: true
})
```

Assim o cliente envia apenas os dados necessários para criação.

---

## PUT

Utilizado para atualizar recursos existentes.

Para permitir atualizações parciais dos campos utilizamos:

```ts
professorSchema.partial()
```

O método `.partial()` transforma todos os campos do schema em opcionais.

---

## DELETE

Responsável por remover recursos.

Seu fluxo normalmente consiste em:

1. Receber o ID.
2. Chamar o Service.
3. Retornar a resposta.

---

## Integração com o Zod

O Fastify utiliza os Schemas do Zod para validar automaticamente requisições e respostas.

Exemplo:

```ts
schema: {
    response: {
        200: professorSchema
    }
}
```

O mesmo Schema também fornece tipagem automática para o TypeScript.

---

## Integração com o Swagger

Como as rotas utilizam Schemas do Zod, o Swagger consegue gerar automaticamente a documentação da API.

Fluxo:

```text
Schema do Zod

↓

Validação

↓

Tipagem

↓

Swagger

↓

Documentação
```

Dessa forma escrevemos menos código e mantemos documentação e implementação sincronizadas.

---

## Registrando as rotas no servidor

Criar uma rota não é suficiente.

Ela precisa ser registrada no servidor.

Exemplo:

```ts
server.register(getProfessor)
```

Caso isso não seja feito, o endpoint retornará:

```text
404 Not Found
```

---

## Resumo

Neste capítulo aprendemos:

- O funcionamento do HTTP.
- Os principais métodos utilizados em APIs REST.
- Como organizar e implementar rotas no Fastify.
- Como integrar o Zod para validação.
- Como gerar documentação automaticamente com Swagger.
- Como disponibilizar as rotas registrando-as no servidor.