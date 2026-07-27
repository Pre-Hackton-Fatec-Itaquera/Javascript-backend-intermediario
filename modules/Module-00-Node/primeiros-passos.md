# Módulo 01 - Node.js e NPM

## Objetivo do módulo

- Dica - Aperte Control + Shift + V Para ver os arquivos .md com formatações (caso esteja usando o vsCode)

Antes de escrever a primeira linha de código do projeto, precisamos entender quais ferramentas serão responsáveis por executar e gerenciar nossa aplicação.

Neste módulo você irá aprender:

- O que é o Node.js.
- O que é o NPM.
- Como o Node.js executa JavaScript fora do navegador.
- Como instalar dependências em um projeto.
- Como criar um projeto Node.
- Como descobrir novas bibliotecas para utilizar nos seus projetos.

---

## O que é o Node.js?

O JavaScript nasceu para ser executado exclusivamente dentro do navegador.

Isso significa que, originalmente, ele era utilizado apenas para criar funcionalidades em páginas web, como:

- Botões.
- Formulários.
- Validação de dados.
- Interações visuais.

Com o surgimento do Node.js, tornou-se possível executar JavaScript fora do navegador.

Em outras palavras, o Node.js permite utilizar JavaScript para desenvolver:

- APIs.
- Sistemas backend.
- Ferramentas de linha de comando (CLI).
- Aplicações desktop.
- Scripts de automação.
- Jogos.
- Servidores HTTP.

É graças ao Node.js que conseguimos utilizar JavaScript tanto no frontend quanto no backend.

---

## Como o Node.js funciona?

O Node.js é um ambiente de execução (runtime) construído sobre o mecanismo V8, o mesmo utilizado pelo Google Chrome.

De forma simplificada, o fluxo funciona assim:

```text
Código JavaScript
        ↓
      Node.js
        ↓
    Engine V8
        ↓
Código executado pelo sistema operacional
```

Quando executamos:

```bash
node server.js
```

O Node.js é responsável por:

1. Ler o arquivo.
2. Interpretar o código JavaScript.
3. Executar as instruções.
4. Disponibilizar recursos que não existem no navegador.

Por exemplo:

```js
import fs from "node:fs";
```

ou

```js
import http from "node:http";
```

Essas funcionalidades são disponibilizadas pelo próprio Node.js.

---

## O que é o NPM?

NPM significa:

```text
Node Package Manager
```

Ele é o gerenciador de pacotes oficial do Node.js.

Sua principal função é instalar, remover e atualizar bibliotecas utilizadas no projeto.

Por exemplo:

```bash
npm install fastify
```

Ao executar esse comando, o NPM:

1. Procura o pacote no registro oficial.
2. Faz o download da biblioteca.
3. Instala todas as suas dependências.
4. Atualiza o package.json.
5. Atualiza o package-lock.json.

---

## O que é um pacote?

Um pacote é simplesmente um projeto disponibilizado para ser utilizado por outros desenvolvedores.

Exemplos de pacotes famosos:

- Fastify.
- React.
- Zod.
- TypeScript.
- Axios.
- Prisma.
- Drizzle ORM.

Em vez de desenvolver tudo do zero, utilizamos bibliotecas que resolvem problemas específicos do nosso projeto.

---

## Como criar um projeto Node.js?

Podemos utilizar o seguinte comando:

```bash
npm init -y
```

Esse comando cria automaticamente o arquivo:

```text
package.json
```

Esse arquivo será responsável por armazenar informações importantes do projeto, como:

- Nome.
- Versão.
- Dependências.
- Scripts.
- Tipo do projeto.
- Configurações diversas.

No próximo módulo iremos estudá-lo em detalhes.

---

## Onde encontrar bibliotecas?

O maior catálogo de pacotes do ecossistema JavaScript pode ser encontrado no site oficial do NPM.

Site oficial:

https://www.npmjs.com/

Algumas categorias bastante utilizadas:

- Frameworks backend.
- Frameworks frontend.
- Banco de dados.
- Validação.
- Testes.
- Segurança.
- Ferramentas de desenvolvimento.

Antes de adicionar qualquer biblioteca ao seu projeto, procure responder algumas perguntas:

- Ela é bem documentada?
- Possui manutenção ativa?
- Possui muitos downloads?
- É utilizada pela comunidade?
- Resolve um problema real do projeto?

Uma boa prática é evitar adicionar dependências desnecessárias.

---

## Materiais complementares

### Documentações

Node.js

https://nodejs.org/docs/latest/api/

NPM

https://docs.npmjs.com/

Registro oficial do NPM

https://www.npmjs.com/

---

### Vídeos recomendados

Node.js em 100 segundos (Fireship)

https://www.youtube.com/watch?v=TlB_eWDSMt4

O que é Node.js? (Rocketseat)

https://www.youtube.com/results?search_query=o+que+%C3%A9+node+js+rocketseat

NPM explicado (Fireship)

https://www.youtube.com/results?search_query=npm+fireship

---

## Resumo

Neste módulo aprendemos:

- O que é o Node.js.
- Como o JavaScript é executado fora do navegador.
- O que é o NPM.
- Como instalar bibliotecas.
- Como criar um projeto Node.js.
- Onde encontrar novos pacotes para utilizar nos seus projetos.

No próximo módulo iremos estudar o arquivo package.json e entender como ele organiza todo o nosso projeto.