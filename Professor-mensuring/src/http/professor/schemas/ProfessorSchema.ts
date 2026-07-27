import z from "zod";

export const professorSchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Insira ao menos um nome com 3 caracteres"),
});
