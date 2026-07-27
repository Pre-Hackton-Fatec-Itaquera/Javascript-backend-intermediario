// 📐 SCHEMA (contrato de dados)
//
// O schema Zod define o formato que os dados devem ter.
// Ele serve como CONTRATO entre as camadas:
//
//   1. Validação de entrada (body da request)
//   2. Validação de saída (response)
//   3. Documentação automática (Swagger em /docs)
//
// Mantemos UM schema por entidade e usamos .omit(), .partial()
// etc. nas rotas para derivar variações (create, update, response).
// Isso evita duplicar campos idênticos em schemas diferentes.

import z from "zod";

export const subjectSchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Insira ao menos um nome com 3 caracteres"),
    semester: z.number(),
    createdAt: z.date(),
});
