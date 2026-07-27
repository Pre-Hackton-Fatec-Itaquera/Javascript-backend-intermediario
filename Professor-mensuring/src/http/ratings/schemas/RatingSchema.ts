import z from "zod";

export const ratingSchema = z.object({
    id: z.string(),
    value: z.number().min(1).max(5),
    comment: z.string().max(255).nullable(),
    createdAt: z.date(),
    professorSubjectId: z.string(),
});
