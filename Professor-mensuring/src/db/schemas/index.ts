import { professor } from "#db/schemas/professor.ts";
import { professorSubject } from "#db/schemas/professorSubject.ts";
import { ratings } from "#db/schemas/ratings.ts";
import { subjects } from "#db/schemas/subject.ts";

export const schema = {
    professor,
    professorSubject,
    ratings,
    subjects,
};
