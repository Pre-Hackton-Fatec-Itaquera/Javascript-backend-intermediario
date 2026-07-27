import { pgTable, uuid, text, real, timestamp } from "drizzle-orm/pg-core";

export const subjects = pgTable('subjects', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    semester: real().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
})