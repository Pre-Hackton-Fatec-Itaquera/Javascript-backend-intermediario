# Módulo 03 - Configurando o servidor

## Objetivo do módulo

Todo projeto backend precisa de um ponto de entrada. É ele quem será responsável por inicializar a aplicação, registrar suas funcionalidades e colocá-la para funcionar.

Neste módulo iremos aprender:

- O que é um servidor HTTP.
- O que é o Fastify.
- Qual a responsabilidade do arquivo `server.ts`.
- Como registrar plugins e rotas.
- Como iniciar o servidor.

---

## O que é um servidor HTTP?

Antes de falarmos sobre código, vamos utilizar uma analogia bastante simples.

Imagine um restaurante.

```text
Cliente
   ↓
Garçom
   ↓
Cozinha
   ↓
Garçom
   ↓
Cliente
```

O cliente realiza um pedido, o garçom recebe a solicitação, leva para a cozinha e, após o preparo, entrega a resposta.

Um servidor HTTP funciona praticamente da mesma maneira.

```text
Cliente (Browser ou Frontend)
            ↓
         Servidor
            ↓
      Processa a requisição
            ↓
      Consulta serviços e banco de dados
            ↓
        Retorna uma resposta
```

Sempre que um usuário acessa uma página, envia um formulário ou realiza uma requisição para uma API, existe um servidor recebendo essa informação e retornando alguma resposta.

---

## O que é o Fastify?

O Fastify é o framework que utilizaremos para criar o nosso servidor HTTP.

Ele será responsável por diversas funcionalidades do projeto, como:

- Criar o servidor.
- Registrar rotas.
- Registrar plugins.
- Validar requisições.
- Gerenciar respostas HTTP.
- Configurar middlewares e handlers.

Sua simplicidade e excelente integração com TypeScript fazem dele uma ótima opção para projetos modernos.

---

## Criando o servidor

A criação do servidor é extremamente simples:

```ts
const server = Fastify();
```

A partir desse momento já possuímos uma instância do nosso servidor HTTP.

No entanto, neste projeto utilizaremos uma pequena configuração adicional.

```ts
const server = Fastify().withTypeProvider<ZodTypeProvider>();
```

Essa configuração permite que o Fastify trabalhe em conjunto com o Zod, possibilitando:

- Inferência automática de tipos.
- Validação das requisições.
- Melhor integração com o Swagger.

---

## Qual é a responsabilidade do server.ts?

O arquivo `server.ts` possui apenas uma responsabilidade:

> Configurar e inicializar a aplicação.

Ele NÃO deve possuir regras de negócio.

Toda a lógica do projeto será delegada para outras camadas da aplicação.

Seu papel é simplesmente "ligar" todas as peças do sistema.

---

## O que configuramos no servidor?

Ao longo do projeto iremos registrar diversas funcionalidades no servidor.

Por exemplo:

```ts
server.register(...);
```

Algumas delas são:

- CORS.
- Swagger.
- Swagger UI.
- Rotas.
- Error Handler.

Cada uma dessas funcionalidades possui sua própria responsabilidade e será estudada em módulos específicos.

---

## Registrando plugins

O Fastify trabalha fortemente utilizando plugins.

Sempre que desejarmos adicionar uma nova funcionalidade ao servidor, utilizaremos o método:

```ts
server.register();
```

Exemplo:

```ts
server.register(fastifyCors);
```

ou

```ts
server.register(subjectRoutes);
```

Essa abordagem torna o projeto muito mais modular e organizado.

---

## Registrando as rotas

Após criar nossas rotas, precisamos registrá-las no servidor.

Exemplo:

```ts
server.register(checkHealth);

server.register(getProfessor);

server.register(subjectRoutes);

server.register(professorSubjectRoutes);

server.register(ratingRoutes);
```

Isso significa que o servidor agora conhece todas as rotas disponíveis da aplicação.

Sempre que uma requisição for recebida, o Fastify será responsável por direcioná-la para a rota correta.

---

## Tratamento global de erros

Também registramos um Error Handler global.

```ts
server.setErrorHandler(errorHandler);
```

Seu objetivo é interceptar erros lançados pela aplicação e retornar respostas padronizadas para o cliente.

Exemplos:

```text
404 - Recurso não encontrado.

400 - Dados inválidos.

500 - Erro interno do servidor.
```

Mais detalhes sobre o Error Handler serão abordados em um módulo próprio.

---

## Inicializando o servidor

Por fim, precisamos colocar nossa aplicação para escutar requisições.

```ts
server.listen({
    port: Number(env.PORT) || 3333,
    host: "0.0.0.0"
});
```

---

## O que é uma porta?

Uma porta pode ser entendida como um canal de comunicação utilizado pelo sistema operacional.

Quando definimos:

```ts
port: 3333
```

estamos dizendo:

> "Minha aplicação estará aguardando requisições através da porta 3333."

É por isso que conseguimos acessar nossa API através do navegador utilizando:

```text
http://localhost:3333
```

---

## O que significa o host?

Neste projeto utilizamos:

```ts
host: "0.0.0.0"
```

Essa configuração informa que o servidor poderá receber conexões provenientes de qualquer interface de rede disponível.

Isso é especialmente útil quando trabalhamos com:

- Docker.
- Máquinas virtuais.
- Outros dispositivos na mesma rede.

Caso utilizássemos:

```ts
host: "localhost"
```

apenas o próprio computador conseguiria acessar a aplicação.

---

## Estrutura final do arquivo

Ao final deste módulo, nosso servidor será responsável por:

```text
Criar o servidor
        ↓
Configurar o Zod
        ↓
Registrar plugins
        ↓
Registrar rotas
        ↓
Configurar o Error Handler
        ↓
Inicializar a aplicação
```

Observe que o arquivo continua bastante simples. Isso é proposital.

Um bom `server.ts` normalmente possui pouca lógica de negócio e apenas coordena os principais componentes da aplicação.

---

## Materiais complementares

### Documentações

Fastify

https://fastify.dev/docs/latest/

Fastify Plugins

https://fastify.dev/docs/latest/Reference/Plugins/

Node.js HTTP

https://nodejs.org/docs/latest/api/http.html

---

### Vídeos recomendados

Pesquise por:

- O que é um servidor HTTP.
- Como funciona uma API REST.
- Fastify para iniciantes.

---

## Resumo

Neste módulo aprendemos:

- O que é um servidor HTTP.
- Como criar um servidor utilizando o Fastify.
- Qual a responsabilidade do arquivo `server.ts`.
- Como registrar plugins e rotas.
- O que são portas e hosts.
- Como inicializar a aplicação.

Nos próximos módulos iremos estudar individualmente cada uma das configurações registradas no servidor.