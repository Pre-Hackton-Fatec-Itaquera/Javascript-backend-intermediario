# Professor-mensuring (Backend - Curso Intermediário)

Este repositório contém o backend usado no pré-hackathon e os módulos explicativos.

Quickstart

1. Instalar dependências

```bash
npm install
```

2. Subir o banco (docker)

```bash
docker compose up -d
```

3. Criar arquivo `.env` copiando o `.env.example` e ajustando se necessário

4. Rodar em modo dev

```bash
npm run dev
```

Comandos úteis

- `npm run db:migrate` — aplica migrations
- `npm run db:generate` — gera migrations com `drizzle-kit`
- `npm test` — executa testes

Observação sobre projetos duplicados

Alguns arquivos e `package.json` aparecem em dois locais (`modules/` e `Professor-mensuring/`) porque o conteúdo `modules/` é material didático separado do projeto executável em `Professor-mensuring/`. Recomendamos que, após clonar o repositório, os participantes trabalhem com o projeto principal em `Professor-mensuring/` (ou copiem esse diretório para um local separado) para evitar confusão entre dependências e comandos.

Se preferir isolar completamente, clone o repositório e copie apenas o diretório `Professor-mensuring/` para um novo local de trabalho.
