# Suporte do Projeto

Este arquivo centraliza as tecnologias usadas neste material e serve como ponto de partida para quem estiver acompanhando os módulos.

## Objetivo

O projeto foi organizado para explicar, na prática, como um backend Node.js em TypeScript evolui de uma base simples até camadas mais completas, como servidor, CORS, Swagger, banco de dados, tratamento de erros e testes.

## Tecnologias usadas

### Node.js

Ambiente de execução JavaScript no servidor. É a base de todo o projeto e aparece desde os primeiros módulos introdutórios.

Documentação oficial: [nodejs.org/docs](https://nodejs.org/docs)

### TypeScript

Adiciona tipagem estática ao JavaScript, melhorando organização, previsibilidade e manutenção do código.

Documentação oficial: [typescriptlang.org/docs](https://www.typescriptlang.org/docs/)

### Fastify

Framework HTTP usado para construir o servidor e estruturar rotas, plugins e validações.

Documentação oficial: [fastify.dev/docs](https://fastify.dev/docs/latest/)

### Zod

Biblioteca de validação e inferência de tipos. É usada para validar dados de entrada com segurança.

Documentação oficial: [zod.dev](https://zod.dev/)

### fastify-type-provider-zod

Integra Fastify com Zod, permitindo que validação e tipos trabalhem juntos na camada HTTP.

Documentação do pacote: [npmjs.com/package/fastify-type-provider-zod](https://www.npmjs.com/package/fastify-type-provider-zod)

### CORS

Configuração de segurança para controlar quais origens podem acessar a API.

Referência web: [developer.mozilla.org/Web/HTTP/CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

### Swagger / OpenAPI

Documentação interativa da API, útil para explorar rotas e contratos de entrada e saída.

Especificação OpenAPI: [openapis.org](https://www.openapis.org/)

Swagger docs: [swagger.io/docs](https://swagger.io/docs/)

### Drizzle ORM

ORM usado para modelar tabelas, relacionamentos e consultas de banco de dados com foco em tipagem.

Documentação oficial: [orm.drizzle.team](https://orm.drizzle.team/)

### Drizzle Kit

Ferramenta de suporte para gerar migrations, manter o schema sincronizado e facilitar o fluxo de banco.

Documentação oficial: [orm.drizzle.team/kit-docs](https://orm.drizzle.team/kit-docs/overview)

### PostgreSQL

Banco de dados relacional usado para persistência dos dados do domínio do projeto.

Documentação oficial: [postgresql.org/docs](https://www.postgresql.org/docs/)

### docker / docker-compose

Usados para subir serviços de forma previsível, facilitando o ambiente local e a reprodução do projeto.

Documentação Docker: [docs.docker.com](https://docs.docker.com/)

Referência do Compose: [docs.docker.com/compose](https://docs.docker.com/compose/)

### Vitest

Framework de testes usado para validar regras e comportamentos do código.

Documentação oficial: [vitest.dev](https://vitest.dev/)

### tsx

Executa arquivos TypeScript diretamente durante o desenvolvimento, sem etapa manual de build.

Documentação do pacote: [npmjs.com/package/tsx](https://www.npmjs.com/package/tsx)

## Onde cada parte aparece

### Base e servidor

- [Module-00-Node/primeiros-passos.md](Module-00-Node/primeiros-passos.md)
- [Module-03-Servidor/configuracao-servidor.md](Module-03-Servidor/configuracao-servidor.md)

### Estrutura e organização

- [Module-02-Estrutura-pastas/arquitetura.md](Module-02-Estrutura-pastas/arquitetura.md)

### CORS e Swagger

- [Module-04-CORS/configuracao-cors.md](Module-04-CORS/configuracao-cors.md)
- [Module-05-Swagger/configuracao-swagger.md](Module-05-Swagger/configuracao-swagger.md)

### Docker e banco de dados

- [Module-06-Docker/docker-config.md](Module-06-Docker/docker-config.md)
- [Module-07-Banco-De-Dados/readme.md](Module-07-Banco-De-Dados/readme.md)
- [Module-07-Banco-De-Dados/conexao.md](Module-07-Banco-De-Dados/conexao.md)
- [Module-07-Banco-De-Dados/configuracao.md](Module-07-Banco-De-Dados/configuracao.md)
- [Module-07-Banco-De-Dados/schemas.md](Module-07-Banco-De-Dados/schemas.md)
- [Module-07-Banco-De-Dados/migrations.md](Module-07-Banco-De-Dados/migrations.md)

### Camada HTTP, erros e testes

- [Module-08-Camada-HTTP/readme.md](Module-08-Camada-HTTP/readme.md)
- [Module-08-Camada-HTTP/arquitetura.md](Module-08-Camada-HTTP/arquitetura.md)
- [Module-08-Camada-HTTP/rotas.md](Module-08-Camada-HTTP/rotas.md)
- [Module-09-Error-Handler/erros-personalizados.md](Module-09-Error-Handler/erros-personalizados.md)
- [Module-10-Testes/testes-unitarios.md](Module-10-Testes/testes-unitarios.md)

## Scripts principais

- `npm run dev` inicia o servidor em modo de desenvolvimento.
- `npm run db:generate` gera migrations do Drizzle.
- `npm run db:migrate` aplica migrations no banco.
- `npm run db:studio` abre a interface do Drizzle Studio.
- `npm test` executa os testes com Vitest.

## Observação para estudo

A ideia deste material é mostrar o caminho completo de um backend real, então os exemplos podem crescer em complexidade conforme os módulos avançam. O melhor uso é seguir a ordem dos módulos e observar como cada conceito reaparece em um contexto prático.