import { pgTable, uuid, text } from "drizzle-orm/pg-core";

export const professor = pgTable('professor', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
});
