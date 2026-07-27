import { pgTable, uuid, unique } from "drizzle-orm/pg-core";
import { professor } from "./professor.ts";
import { subjects } from "./subject.ts";

export const professorSubject = pgTable('professor_subject', {
    id: uuid().primaryKey().defaultRandom(),
    professorId: uuid().notNull().references(() => professor.id, { onDelete: "cascade" }),
    subjectId: uuid().notNull().references(() => subjects.id, { onDelete: "cascade" }),
}, (t) => [
    unique().on(t.professorId, t.subjectId),
]);
