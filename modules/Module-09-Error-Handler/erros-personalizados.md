# Módulo 09 - Tratamento de Erros

Até aqui nossa API já é capaz de:

- Receber requisições.
- Validar dados utilizando Zod.
- Conversar com o banco de dados.
- Aplicar regras de negócio.
- Retornar respostas HTTP.

Porém, ainda existe um grande problema.

O que acontece quando algo dá errado?

Imagine os seguintes cenários:

- Um professor não foi encontrado no banco.
- O usuário enviou um UUID inválido.
- Um campo obrigatório não foi informado.
- Uma regra de negócio foi violada.
- O banco de dados ficou indisponível.

Sem um tratamento centralizado de erros, cada rota precisaria implementar diversos blocos de:

```ts
try {
    ...
} catch(error){
    ...
}
```

Além de deixar o código repetitivo, isso dificulta a manutenção da aplicação.

---

## O que é um Error Handler?

Um Error Handler é um mecanismo responsável por interceptar todos os erros da aplicação e transformá-los em respostas HTTP padronizadas.

Em vez de tratar erros individualmente em cada rota, podemos centralizar toda a lógica em um único lugar.

Por exemplo:

```text
Requisição

↓

Rota

↓

Service

↓

Repository

↓

ERRO!

↓

Error Handler

↓

Resposta HTTP padronizada
```

---

## Vantagens

Ao centralizar o tratamento de erros conseguimos:

- Reduzir código duplicado.
- Melhorar a manutenção do projeto.
- Padronizar as respostas da API.
- Facilitar a criação de erros personalizados.
- Melhorar a experiência de quem consome a API.

---

## Estrutura do projeto

Neste projeto utilizaremos duas pastas:

```text
src

errors
handlers
```

### errors

Responsável por armazenar nossos erros personalizados.

Exemplo:

```text
errors

badRequestError.ts
notFoundError.ts
unauthorizedError.ts
```

---

### handlers

Responsável por armazenar o Error Handler do Fastify.

Exemplo:

```text
handlers

errorHandler.ts
```

---

## Fluxo completo

```text
Request

↓

Route

↓

Service

↓

Repository

↓

Throw Error

↓

Error Handler

↓

HTTP Response
```

---

## Material complementar

Fastify Error Handler:

https://fastify.dev/docs/latest/Reference/Server/#seterrorhandler

JavaScript Errors:

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error