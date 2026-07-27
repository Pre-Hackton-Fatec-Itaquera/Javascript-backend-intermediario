# Módulo 10 - Testes de Integração

Um dos maiores problemas de um projeto em crescimento é garantir que novas funcionalidades não quebrem funcionalidades já existentes.

É exatamente para isso que utilizamos testes.

Neste módulo iremos aprender:

- O que são testes de integração.
- Como organizar os testes do projeto.
- Como utilizar o Vitest.
- Como utilizar arquivos .http para testes manuais.

---

## Por que testar?

Imagine a seguinte situação.

Você implementou:

- Cadastro de professores.
- Cadastro de matérias.
- Avaliações.
- Relacionamentos entre entidades.

Tudo funciona perfeitamente.

Alguns dias depois, você realiza uma pequena alteração no código do professor e, sem perceber, quebra o funcionamento das avaliações.

Sem testes, provavelmente esse problema só seria descoberto durante a utilização da API.

Com testes conseguimos validar automaticamente que tudo continua funcionando como esperado.

---

## Quando usar testes de integração?

Testes de integração possuem um único objetivo:

> Testar o funcionamento combinado de várias partes do sistema.

Por exemplo:

```text
ProfessorRepository

↓

findById()

↓

Resultado esperado
```

Outro exemplo:

```text
ProfessorService

↓

create()

↓

Regra de negócio aplicada corretamente?
```

Um teste de integração normalmente conhece:

- HTTP
- Rotas
- Banco de dados
- Repositórios

Seu objetivo é validar se o fluxo entre essas partes funciona como esperado.

---

## O que é um teste de integração?

Diferentemente dos testes isolados, os testes de integração verificam se várias partes do sistema funcionam corretamente juntas.

Por exemplo:

```text
Request HTTP

↓

Route

↓

Service

↓

Repository

↓

Banco de dados

↓

Response
```

Nesse caso estamos testando o fluxo completo da aplicação.

---

## Organização dos testes

Neste projeto utilizaremos duas estratégias.

### Testes de integração

Os testes de integração podem ficar próximos do código que estão testando.

Exemplo:

```text
professor

repository

professorRepository.ts

tests

findProfessor.test.ts
```

Essa abordagem facilita a manutenção do projeto, pois os testes ficam próximos da funcionalidade correspondente.

---

### Testes manuais

Além dos testes automatizados, também utilizaremos arquivos HTTP.

Exemplo:

```text
professor

professor.http
```

ou

```text
src

test

globalRoutes.http
```

Esses arquivos permitem realizar requisições diretamente pelo VS Code sem a necessidade de ferramentas externas como:

- Postman
- Insomnia
- Thunder Client

---

## O que é o Vitest?

O Vitest é um framework moderno de testes para aplicações JavaScript e TypeScript.

Neste projeto ele será utilizado para executar nossos testes automatizados.

Algumas vantagens:

- Fácil configuração.
- Excelente integração com TypeScript.
- Alta performance.
- API semelhante ao Jest.

---

## Executando os testes

Todos os testes podem ser executados através do comando:

```bash
npm run test
```

O Vitest irá procurar automaticamente pelos arquivos de teste do projeto e executar cada um deles.

---

## Testes automatizados vs testes manuais

É importante entender que ambos possuem objetivos diferentes.

### Testes automatizados

São utilizados para:

- Validar regras de negócio.
- Garantir que funcionalidades continuem funcionando.
- Facilitar refatorações.

---

### Testes manuais

São utilizados para:

- Experimentar novas rotas.
- Validar rapidamente uma funcionalidade.
- Simular requisições HTTP durante o desenvolvimento.

---

## Fluxo recomendado

Durante o desenvolvimento podemos seguir o seguinte fluxo:

```text
Criar funcionalidade

↓

Criar testes de integração

↓

Executar os testes

↓

Validar utilizando arquivos .http

↓

Refatorar com segurança
```

---

## Material complementar

Vitest:

https://vitest.dev/

Testing JavaScript:

https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Testing

REST Client (VS Code):

https://marketplace.visualstudio.com/items?itemName=humao.rest-client