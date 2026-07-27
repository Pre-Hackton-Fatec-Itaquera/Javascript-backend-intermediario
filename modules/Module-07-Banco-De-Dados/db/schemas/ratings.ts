import { pgTable, uuid, integer, varchar, timestamp, check } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { professorSubject } from "./professorSubject.ts";

export const ratings = pgTable('ratings', {
    id: uuid().primaryKey().defaultRandom(),
    value: integer().notNull(),
    comment: varchar({ length: 255 }),
    createdAt: timestamp().defaultNow().notNull(),
    professorSubjectId: uuid().notNull().references(() => professorSubject.id, { onDelete: "cascade" }),
}, (t) => [
    check("rating_value_check", sql`${t.value} >= 1 AND ${t.value} <= 5`),
]);
