# Módulo 04 - CORS (Cross-Origin Resource Sharing)

## Objetivo do módulo

Neste módulo iremos aprender:

- O que é o CORS.
- Por que ele existe.
- Como o navegador protege nossas aplicações.
- Como configurar o CORS no Fastify.
- Boas práticas ao permitir origens na aplicação.

---

## O que é CORS?

CORS significa:

```text
Cross-Origin Resource Sharing
```

Apesar do nome parecer complicado, o conceito é bastante simples.

O CORS é um mecanismo de segurança implementado pelos navegadores para controlar quais aplicações podem consumir a nossa API.

Imagine a seguinte situação:

```text
Frontend
↓
http://localhost:5173

Backend
↓
http://localhost:3333
```

Mesmo estando no mesmo computador, eles são considerados origens diferentes.

Uma origem é composta por:

```text
PROTOCOLO + DOMÍNIO + PORTA
```

Exemplo:

```text
http://localhost:3333

PROTOCOLO -> http
DOMÍNIO   -> localhost
PORTA     -> 3333
```

Se qualquer uma dessas informações mudar, a origem será considerada diferente.

---

## Por que o CORS existe?

Imagine que você esteja logado em um sistema bancário.

Agora imagine que você acessa um site malicioso em outra aba do navegador.

Sem o CORS, esse site poderia tentar fazer requisições automaticamente utilizando a sua sessão autenticada.

O CORS existe justamente para evitar esse tipo de comportamento.

Por padrão, o navegador bloqueia requisições entre origens diferentes.

---

## O CORS é uma proteção do navegador

Um detalhe extremamente importante:

> O CORS NÃO é uma proteção do backend.

Ele é uma proteção implementada pelos navegadores.

Ferramentas como:

- Postman
- Insomnia
- Thunder Client
- REST Client
- Curl

não respeitam as regras de CORS.

Portanto, nunca utilize o CORS como mecanismo de segurança da sua API.

Se a sua aplicação precisa proteger rotas, utilize:

- Autenticação
- Autorização
- Tokens
- Permissões

---

## Como o Fastify trabalha com CORS?

Para adicionar suporte ao CORS utilizamos o plugin oficial:

```bash
npm i @fastify/cors
```

Após instalado, podemos registrá-lo no servidor.

```ts
server.register(fastifyCors);
```

Também podemos realizar configurações mais avançadas.

---

## Permitindo origens específicas

No nosso projeto utilizamos:

```ts
const allowedOrigins = [
    "http://localhost:5173"
];
```

Isso significa que apenas aplicações executando nesse endereço poderão consumir a API através do navegador.

---

## Por que utilizamos uma função?

Observe que nossa configuração utiliza uma função:

```ts
origin: (origin, cb) => {

}
```

Essa abordagem nos permite:

- Validar a origem recebida.
- Permitir múltiplos domínios.
- Criar regras mais avançadas.

Exemplo:

```ts
origin: (origin, cb) => {

    if (!origin) {
        return cb(null, true);
    }

}
```

---

## Por que verificamos se a origem existe?

Ferramentas como:

- Postman
- REST Client
- Curl

não enviam o cabeçalho Origin.

Por isso fazemos:

```ts
if (!origin) {
    return cb(null, true);
}
```

Isso permite que possamos continuar realizando testes normalmente durante o desenvolvimento.

---

## Normalizando a origem

No projeto utilizamos:

```ts
const normalizedOrigin = origin
    .replace(/\/$/, "")
    .toLowerCase();
```

Essa pequena transformação possui dois objetivos:

1. Remover barras no final da URL.

```text
http://localhost:5173/
```

↓

```text
http://localhost:5173
```

2. Ignorar diferenças entre letras maiúsculas e minúsculas.

```text
LOCALHOST
```

↓

```text
localhost
```

Isso torna a comparação mais consistente.

---

## Validando a origem

Após normalizar a URL, verificamos se ela está presente na lista de origens permitidas.

```ts
if (allowedOrigins.includes(normalizedOrigin)) {
    return cb(null, true);
}
```

Caso esteja permitida:

```text
Requisição autorizada.
```

Caso contrário:

```ts
return cb(
    new Error("Permissão não concedida pelo CORS"),
    false
);
```

---

## Outros parâmetros utilizados

### Credentials

```ts
credentials: true
```

Permite o envio de:

- Cookies
- Headers de autenticação
- Informações da sessão

---

### Methods

```ts
methods: [
    "OPTIONS",
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
]
```

Define quais métodos HTTP poderão ser utilizados.

---

### Allowed Headers

```ts
allowedHeaders: [
    "Content-Type",
    "Authorization"
]
```

Define quais cabeçalhos serão aceitos pelo servidor.

---

## Boas práticas

Evite fazer isso:

```ts
origin: "*"
```

Apesar de ser bastante comum durante o desenvolvimento, permitir qualquer origem não é uma boa prática para ambientes de produção.

Prefira sempre trabalhar com listas explícitas de domínios permitidos.

---

## Materiais complementares

### Documentação

Fastify CORS

https://github.com/fastify/fastify-cors

MDN - CORS

https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## Resumo

Neste módulo aprendemos:

- O que é o CORS.
- Como ele funciona.
- Por que ele existe.
- Como configurá-lo no Fastify.
- Boas práticas de utilização.

No próximo módulo iremos aprender como documentar automaticamente nossa API utilizando o Swagger.