import { env } from "#lib/env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    casing: "camelCase",
    schema: "./src/db/schemas/**.ts",
    out: "./src/db/migrations",
    dbCredentials: {
        url: env.DATABASE_URL
    }
})