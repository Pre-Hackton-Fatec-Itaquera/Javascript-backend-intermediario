import z from "zod";

export const professorSubjectSchema = z.object({
    id: z.string(),
    professorId: z.string(),
    subjectId: z.string(),
});

export const averageSchema = z.object({
    professorSubjectId: z.string(),
    average: z.number(),
    count: z.number(),
});
