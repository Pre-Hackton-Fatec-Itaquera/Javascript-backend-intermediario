import { defineConfig } from "vitest/config";
import { readFileSync } from "node:fs";

const envContent = readFileSync(".env", "utf-8");
for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const eqIndex = trimmed.indexOf("=");
        let value = trimmed.slice(eqIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        process.env[trimmed.slice(0, eqIndex).trim()] = value;
    }
}

export default defineConfig({
    test: {
        testTimeout: 30000,
    },
});
