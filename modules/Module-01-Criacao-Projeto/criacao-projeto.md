# Módulo 01 - Criando o projeto

## Objetivo do módulo

Neste módulo iremos criar a estrutura inicial do nosso projeto backend utilizando Node.js e TypeScript.

Ao final deste módulo você terá:

- Um projeto Node.js inicializado.
- TypeScript configurado.
- Fastify instalado.
- Zod instalado.
- As primeiras configurações do package.json.

---

## Inicializando o projeto

O primeiro passo é criar um projeto Node.js.

Execute o seguinte comando:

```bash
npm init -y
```

Esse comando cria automaticamente o arquivo:

```text
package.json
```

Ele é considerado o "coração" do projeto Node.js, pois é responsável por armazenar informações como:

- Nome do projeto.
- Dependências.
- Scripts.
- Versão.
- Configurações adicionais.

Após executar o comando, seu projeto estará pronto para receber novas dependências.

---

## Instalando o TypeScript

Agora vamos instalar o TypeScript:

```bash
npm i typescript @types/node
```

Mas o que cada pacote faz?

### TypeScript

O TypeScript é um superset do JavaScript que adiciona funcionalidades como:

- Tipagem estática.
- Melhor autocompletar.
- Maior segurança durante o desenvolvimento.
- Melhor experiência utilizando IDEs como o VS Code.

Exemplo:

```ts
const age: number = 18;
```

O TypeScript consegue identificar diversos problemas antes mesmo do código ser executado.

---

### @types/node

O Node.js possui diversas funcionalidades próprias, como:

```ts
process.env

fs.readFile()

http.createServer()
```

Para que o TypeScript consiga entender essas funcionalidades, precisamos instalar suas definições de tipos.

É exatamente esse o papel do pacote:

```text
@types/node
```

Sem ele, diversas APIs do Node.js não seriam reconhecidas corretamente pelo TypeScript.

---

## Configurando o TypeScript

Após instalar o TypeScript, precisamos criar o arquivo:

```text
tsconfig.json
```

Uma excelente referência é o repositório oficial mantido pela comunidade:

https://github.com/tsconfig/bases

Ele disponibiliza configurações prontas para diversas versões do Node.js.

Para este projeto, utilizaremos a configuração recomendada para o Node 24 como ponto de partida:

```text
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "_version": "24.0.0",

  "compilerOptions": {
    "lib": [
      "es2024",
      "ESNext.Array",
      "ESNext.Collection",
      "ESNext.Iterator",
      "ESNext.Promise"
    ],
    "module": "nodenext",
    "target": "es2024",
    "allowImportingTsExtensions": true, //importação de arquivos ts
    "noEmit": true, // não fazer o build

    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "nodenext",
    "resolvePackageJsonImports": true
  }
}
```


> O proprio typescript cria o arquivo atráves do comando: npx tsc --init
> Dica: sempre consulte a documentação oficial do TypeScript antes de criar um tsconfig do zero.

---

## Instalando o Fastify

Agora vamos instalar o framework responsável pelo nosso servidor HTTP.

```bash
npm i fastify
```

O Fastify é um framework backend moderno para Node.js conhecido por:

- Alto desempenho.
- Baixo consumo de recursos.
- Excelente suporte ao TypeScript.
- Sistema de plugins muito simples.
- Ótima experiência para construção de APIs.

Ele será responsável por:

- Criar nosso servidor.
- Registrar rotas.
- Validar requisições.
- Gerenciar plugins.
- Gerenciar respostas HTTP.

---

## Instalando o Zod

Para validar os dados da nossa API utilizaremos o Zod.

```bash
npm i zod
```

O Zod é uma biblioteca de validação e tipagem muito utilizada no ecossistema TypeScript.

Exemplo:

```ts
const userSchema = z.object({
    name: z.string(),
    age: z.number()
});
```

Ele será utilizado durante praticamente todo o projeto para:

- Validar entradas.
- Validar parâmetros.
- Validar respostas.
- Inferir tipos automaticamente.

---

## Integrando Fastify e Zod

Por padrão, o Fastify não possui integração nativa com o Zod.

Para isso iremos instalar:

```bash
npm i fastify-type-provider-zod
```

Esse pacote é responsável por:

- Integrar Fastify e Zod.
- Gerar tipos automaticamente.
- Facilitar a documentação da API.
- Melhorar a experiência com TypeScript.

Ao longo do projeto veremos na prática como essa integração funciona.

---

## Estrutura inicial do projeto

Após as instalações, nossa estrutura será semelhante a:

```text
.
├── node_modules
├── package.json
├── package-lock.json
└── tsconfig.json
```

Em breve iremos criar a pasta:

```text
src/
```

que será responsável por armazenar todo o código da aplicação.

---

## Primeiras configurações do package.json

Neste módulo iremos utilizar apenas algumas configurações básicas.

```json
{
    "type": "module",
    "scripts": {
        "dev": "tsx --env-file .env --watch src/server.ts"
    }
}
```

### type: module

Define que o projeto utilizará o padrão moderno de módulos do JavaScript.

Isso nos permite utilizar:

```ts
import Fastify from "fastify";
```

em vez de:

```js
const Fastify = require("fastify");
```

Esse é o padrão utilizado atualmente nos projetos Node.js modernos.

---

### Scripts

Os scripts permitem executar comandos mais facilmente.

Exemplo:

```bash
npm run dev
```

Em vez de escrever um comando enorme toda vez que formos iniciar o projeto, podemos armazená-lo dentro do package.json.

Ao longo do curso iremos adicionar novos scripts conforme forem necessários.

---

## Materiais complementares

### Documentações

Node.js

https://nodejs.org/docs/latest/api/

TypeScript

https://www.typescriptlang.org/docs/

TSConfig Bases

https://github.com/tsconfig/bases

Fastify

https://fastify.dev/

Zod

https://zod.dev/

Fastify Type Provider Zod

https://github.com/turkerdev/fastify-type-provider-zod

---

### Vídeos recomendados

Fastify em 100 segundos (Fireship)

https://www.youtube.com/results?search_query=fastify+fireship

TypeScript para iniciantes (Rocketseat)

https://www.youtube.com/results?search_query=typescript+rocketseat

Zod explicado

https://www.youtube.com/results?search_query=zod+typescript

---

## Resumo

Neste módulo aprendemos:

- Como criar um projeto Node.js.
- O que é o TypeScript.
- Para que serve o @types/node.
- O que é o Fastify.
- O que é o Zod.
- Como integrar Fastify e Zod.
- As primeiras configurações do package.json.

No próximo módulo iremos configurar o TypeScript e criar a estrutura inicial de diretórios do projeto.