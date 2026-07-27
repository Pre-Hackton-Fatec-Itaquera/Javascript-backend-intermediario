# CRUD Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete CRUD operations for all 4 database tables (professor, subjects, professor_subject, ratings) following the professor pattern.

**Architecture:** One folder per entity under `src/http/`, each with route/service/schema/repository/tests. Schemas define a single base object per entity; routes derive request schemas via `.omit()` and `.partial()`.

**Tech Stack:** Fastify + Zod + Drizzle ORM + PostgreSQL + Vitest

---

### Task 1: Expand Professor CRUD (add GET/:id, POST, PUT, DELETE)

**Files:**
- Modify: `src/http/professor/schemas/ProfessorSchema.ts`
- Modify: `src/http/professor/repository/professorRepository.ts`
- Modify: `src/http/professor/repository/tests/findProfessor.test.ts`
- Modify: `src/http/professor/services/ProfessorServices.ts`
- Modify: `src/http/professor/route/ProfessorRoutes.ts`

- [ ] **Step 1: Update ProfessorSchema.ts**

```typescript
import z from "zod";

export const professorSchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Insira ao menos um nome com 3 caracteres"),
});
```

No change needed — already correct. Move to next step.

- [ ] **Step 2: Update professorRepository.ts**

Read current file first, then replace with:

```typescript
import { db } from "#db/connection.ts"
import { schema } from "#db/schemas/index.ts"
import { eq } from "drizzle-orm"

export const findAll = async () => {
    return await db.select().from(schema.professor)
}

export const findById = async (id: string) => {
    const [result] = await db.select().from(schema.professor).where(eq(schema.professor.id, id))
    return result
}

export const create = async (data: { name: string }) => {
    const [result] = await db.insert(schema.professor).values(data).returning()
    return result
}

export const update = async (id: string, data: { name?: string }) => {
    const [result] = await db.update(schema.professor).set(data).where(eq(schema.professor.id, id)).returning()
    return result
}

export const remove = async (id: string) => {
    const [result] = await db.delete(schema.professor).where(eq(schema.professor.id, id)).returning()
    return result
}
```

- [ ] **Step 3: Update ProfessorServices.ts**

```typescript
import * as professorRepository from "#http/professor/repository/professorRepository.ts"
import { NotFoundError } from "#errors/notFoundError.ts"

export const findAll = async () => {
    return await professorRepository.findAll()
}

export const findById = async (id: string) => {
    const professor = await professorRepository.findById(id)
    if (!professor) throw new NotFoundError("Professor não encontrado.")
    return professor
}

export const create = async (data: { name: string }) => {
    return await professorRepository.create(data)
}

export const update = async (id: string, data: { name?: string }) => {
    const professor = await professorRepository.findById(id)
    if (!professor) throw new NotFoundError("Professor não encontrado.")
    return await professorRepository.update(id, data)
}

export const remove = async (id: string) => {
    const professor = await professorRepository.findById(id)
    if (!professor) throw new NotFoundError("Professor não encontrado.")
    return await professorRepository.remove(id)
}
```

- [ ] **Step 4: Update ProfessorRoutes.ts**

```typescript
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as professorService from "#http/professor/services/ProfessorServices.ts";
import { professorSchema } from "#http/professor/schemas/ProfessorSchema.ts";
import z from "zod";

const prefix = "/professor"

export const getProfessor: FastifyPluginAsyncZod = async (server) => {
    // GET /professor — lista todos os professores
    server.get(prefix, {
        schema: {
            response: { 200: z.array(professorSchema) }
        }
    }, async () => {
        return await professorService.findAll()
    })

    // GET /professor/:id — busca um professor pelo ID
    server.get(`${prefix}/:id`, {
        schema: {
            response: { 200: professorSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await professorService.findById(id)
    })

    // POST /professor — cria um novo professor
    server.post(prefix, {
        schema: {
            body: professorSchema.omit({ id: true }),
            response: { 201: professorSchema }
        }
    }, async (request, reply) => {
        const data = request.body as { name: string }
        const professor = await professorService.create(data)
        reply.status(201)
        return professor
    })

    // PUT /professor/:id — atualiza um professor
    server.put(`${prefix}/:id`, {
        schema: {
            body: professorSchema.omit({ id: true }).partial(),
            response: { 200: professorSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        const data = request.body as { name?: string }
        return await professorService.update(id, data)
    })

    // DELETE /professor/:id — remove um professor
    server.delete(`${prefix}/:id`, {
        schema: {
            response: { 200: professorSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await professorService.remove(id)
    })
}
```

- [ ] **Step 5: Update test file**

Replace `findProfessor.test.ts` with:

```typescript
import { describe, it, expect } from "vitest"
import * as professorRepository from "#http/professor/repository/professorRepository.ts"

describe("ProfessorRepository", () => {
    it("findAll deve retornar um array", async () => {
        const result = await professorRepository.findAll()
        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
    })

    it("findById deve retornar undefined para ID inexistente", async () => {
        const result = await professorRepository.findById("00000000-0000-0000-0000-000000000000")
        expect(result).toBeUndefined()
    })

    it("create deve inserir e retornar o registro com id", async () => {
        const result = await professorRepository.create({ name: "Professor Teste" })
        expect(result).toBeDefined()
        expect(result.id).toBeDefined()
        expect(result.name).toBe("Professor Teste")
        await professorRepository.remove(result.id)
    })

    it("update deve modificar o nome", async () => {
        const created = await professorRepository.create({ name: "Nome Antigo" })
        const updated = await professorRepository.update(created.id, { name: "Nome Novo" })
        expect(updated.name).toBe("Nome Novo")
        await professorRepository.remove(created.id)
    })

    it("remove deve deletar o registro", async () => {
        const created = await professorRepository.create({ name: "Será Removido" })
        const removed = await professorRepository.remove(created.id)
        expect(removed.id).toBe(created.id)
        const found = await professorRepository.findById(created.id)
        expect(found).toBeUndefined()
    })
})
```

- [ ] **Step 6: Run tests to verify**

Run: `npx vitest run src/http/professor/repository/tests/findProfessor.test.ts`
Expected: 5 tests pass

---

### Task 2: Create Subjects CRUD

**Files:**
- Create: `src/http/subjects/schemas/SubjectSchema.ts`
- Create: `src/http/subjects/repository/subjectRepository.ts`
- Create: `src/http/subjects/repository/tests/subjectRepository.test.ts`
- Create: `src/http/subjects/services/SubjectServices.ts`
- Create: `src/http/subjects/route/SubjectRoutes.ts`

- [ ] **Step 1: Create directory structure**

Run:
```
mkdir -p src/http/subjects/schemas
mkdir -p src/http/subjects/repository/tests
mkdir -p src/http/subjects/services
mkdir -p src/http/subjects/route
```

- [ ] **Step 2: Create SubjectSchema.ts**

```typescript
import z from "zod";

export const subjectSchema = z.object({
    id: z.string(),
    name: z.string().min(3, "Insira ao menos um nome com 3 caracteres"),
    semester: z.number(),
    createdAt: z.string(),
});
```

- [ ] **Step 3: Create subjectRepository.ts**

```typescript
import { db } from "#db/connection.ts"
import { schema } from "#db/schemas/index.ts"
import { eq } from "drizzle-orm"

export const findAll = async () => {
    return await db.select().from(schema.subjects)
}

export const findById = async (id: string) => {
    const [result] = await db.select().from(schema.subjects).where(eq(schema.subjects.id, id))
    return result
}

export const create = async (data: { name: string; semester: number }) => {
    const [result] = await db.insert(schema.subjects).values(data).returning()
    return result
}

export const update = async (id: string, data: { name?: string; semester?: number }) => {
    const [result] = await db.update(schema.subjects).set(data).where(eq(schema.subjects.id, id)).returning()
    return result
}

export const remove = async (id: string) => {
    const [result] = await db.delete(schema.subjects).where(eq(schema.subjects.id, id)).returning()
    return result
}
```

- [ ] **Step 4: Create subjectRepository.test.ts**

```typescript
import { describe, it, expect } from "vitest"
import * as subjectRepository from "#http/subjects/repository/subjectRepository.ts"

describe("SubjectRepository", () => {
    it("findAll deve retornar um array", async () => {
        const result = await subjectRepository.findAll()
        expect(result).toBeDefined()
        expect(Array.isArray(result)).toBe(true)
    })

    it("findById deve retornar undefined para ID inexistente", async () => {
        const result = await subjectRepository.findById("00000000-0000-0000-0000-000000000000")
        expect(result).toBeUndefined()
    })

    it("create deve inserir e retornar o registro com id", async () => {
        const result = await subjectRepository.create({ name: "Matéria Teste", semester: 1 })
        expect(result).toBeDefined()
        expect(result.id).toBeDefined()
        expect(result.name).toBe("Matéria Teste")
        expect(result.semester).toBe(1)
        await subjectRepository.remove(result.id)
    })

    it("update deve modificar campos", async () => {
        const created = await subjectRepository.create({ name: "Original", semester: 1 })
        const updated = await subjectRepository.update(created.id, { name: "Modificado", semester: 2 })
        expect(updated.name).toBe("Modificado")
        expect(updated.semester).toBe(2)
        await subjectRepository.remove(created.id)
    })

    it("remove deve deletar o registro", async () => {
        const created = await subjectRepository.create({ name: "Será Removido", semester: 1 })
        const removed = await subjectRepository.remove(created.id)
        expect(removed.id).toBe(created.id)
        const found = await subjectRepository.findById(created.id)
        expect(found).toBeUndefined()
    })
})
```

- [ ] **Step 5: Create SubjectServices.ts**

```typescript
import * as subjectRepository from "#http/subjects/repository/subjectRepository.ts"
import { NotFoundError } from "#errors/notFoundError.ts"

export const findAll = async () => {
    return await subjectRepository.findAll()
}

export const findById = async (id: string) => {
    const subject = await subjectRepository.findById(id)
    if (!subject) throw new NotFoundError("Matéria não encontrada.")
    return subject
}

export const create = async (data: { name: string; semester: number }) => {
    return await subjectRepository.create(data)
}

export const update = async (id: string, data: { name?: string; semester?: number }) => {
    const subject = await subjectRepository.findById(id)
    if (!subject) throw new NotFoundError("Matéria não encontrada.")
    return await subjectRepository.update(id, data)
}

export const remove = async (id: string) => {
    const subject = await subjectRepository.findById(id)
    if (!subject) throw new NotFoundError("Matéria não encontrada.")
    return await subjectRepository.remove(id)
}
```

- [ ] **Step 6: Create SubjectRoutes.ts**

```typescript
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as subjectService from "#http/subjects/services/SubjectServices.ts";
import { subjectSchema } from "#http/subjects/schemas/SubjectSchema.ts";
import z from "zod";

const prefix = "/subjects"

export const subjectRoutes: FastifyPluginAsyncZod = async (server) => {
    server.get(prefix, {
        schema: { response: { 200: z.array(subjectSchema) } }
    }, async () => {
        return await subjectService.findAll()
    })

    server.get(`${prefix}/:id`, {
        schema: { response: { 200: subjectSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await subjectService.findById(id)
    })

    server.post(prefix, {
        schema: {
            body: subjectSchema.omit({ id: true, createdAt: true }),
            response: { 201: subjectSchema }
        }
    }, async (request, reply) => {
        const data = request.body as { name: string; semester: number }
        const subject = await subjectService.create(data)
        reply.status(201)
        return subject
    })

    server.put(`${prefix}/:id`, {
        schema: {
            body: subjectSchema.omit({ id: true, createdAt: true }).partial(),
            response: { 200: subjectSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        const data = request.body as { name?: string; semester?: number }
        return await subjectService.update(id, data)
    })

    server.delete(`${prefix}/:id`, {
        schema: { response: { 200: subjectSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await subjectService.remove(id)
    })
}
```

- [ ] **Step 7: Run tests**

Run: `npx vitest run src/http/subjects/repository/tests/subjectRepository.test.ts`
Expected: 5 tests pass

---

### Task 3: Create Professor-Subject CRUD (POST, GET, DELETE) + Average

**Files:**
- Create: `src/http/professor-subject/schemas/ProfessorSubjectSchema.ts`
- Create: `src/http/professor-subject/repository/professorSubjectRepository.ts`
- Create: `src/http/professor-subject/repository/tests/professorSubjectRepository.test.ts`
- Create: `src/http/professor-subject/services/ProfessorSubjectServices.ts`
- Create: `src/http/professor-subject/route/ProfessorSubjectRoutes.ts`

- [ ] **Step 1: Create directory structure**

Run:
```
mkdir -p "src/http/professor-subject/schemas"
mkdir -p "src/http/professor-subject/repository/tests"
mkdir -p "src/http/professor-subject/services"
mkdir -p "src/http/professor-subject/route"
```

- [ ] **Step 2: Create ProfessorSubjectSchema.ts**

```typescript
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
```

- [ ] **Step 3: Create professorSubjectRepository.ts**

```typescript
import { db } from "#db/connection.ts"
import { schema } from "#db/schemas/index.ts"
import { eq, and, sql } from "drizzle-orm"

export const findAll = async (filters?: { professorId?: string; subjectId?: string }) => {
    const conditions = []
    if (filters?.professorId) conditions.push(eq(schema.professorSubject.professorId, filters.professorId))
    if (filters?.subjectId) conditions.push(eq(schema.professorSubject.subjectId, filters.subjectId))

    const query = db.select().from(schema.professorSubject)
    if (conditions.length > 0) query.where(and(...conditions))
    return await query
}

export const findById = async (id: string) => {
    const [result] = await db.select().from(schema.professorSubject).where(eq(schema.professorSubject.id, id))
    return result
}

export const create = async (data: { professorId: string; subjectId: string }) => {
    const [result] = await db.insert(schema.professorSubject).values(data).returning()
    return result
}

export const remove = async (id: string) => {
    const [result] = await db.delete(schema.professorSubject).where(eq(schema.professorSubject.id, id)).returning()
    return result
}

export const findAverage = async (id: string) => {
    const [result] = await db
        .select({
            average: sql<number>`round(avg(${schema.ratings.value})::numeric, 2)`,
            count: sql<number>`count(${schema.ratings.id})`,
        })
        .from(schema.ratings)
        .where(eq(schema.ratings.professorSubjectId, id))
    return { professorSubjectId: id, average: Number(result.average) || 0, count: Number(result.count) || 0 }
}
```

- [ ] **Step 4: Create professorSubjectRepository.test.ts**

```typescript
import { describe, it, expect } from "vitest"
import * as psRepository from "#http/professor-subject/repository/professorSubjectRepository.ts"
import * as professorRepository from "#http/professor/repository/professorRepository.ts"
import * as subjectRepository from "#http/subjects/repository/subjectRepository.ts"

describe("ProfessorSubjectRepository", () => {
    let professorId: string
    let subjectId: string

    beforeEach(async () => {
        const prof = await professorRepository.create({ name: "Prof Teste" })
        professorId = prof.id
        const subj = await subjectRepository.create({ name: "Matéria Teste", semester: 1 })
        subjectId = subj.id
    })

    afterEach(async () => {
        if (professorId) await professorRepository.remove(professorId).catch(() => {})
        if (subjectId) await subjectRepository.remove(subjectId).catch(() => {})
    })

    it("create deve inserir vínculo", async () => {
        const result = await psRepository.create({ professorId, subjectId })
        expect(result).toBeDefined()
        expect(result.professorId).toBe(professorId)
        expect(result.subjectId).toBe(subjectId)
        await psRepository.remove(result.id)
    })

    it("findAll deve retornar array", async () => {
        const result = await psRepository.findAll()
        expect(Array.isArray(result)).toBe(true)
    })

    it("findById deve retornar undefined para ID inexistente", async () => {
        const result = await psRepository.findById("00000000-0000-0000-0000-000000000000")
        expect(result).toBeUndefined()
    })

    it("findAll com filtro professorId", async () => {
        const link = await psRepository.create({ professorId, subjectId })
        const result = await psRepository.findAll({ professorId })
        expect(result.some(r => r.id === link.id)).toBe(true)
        await psRepository.remove(link.id)
    })

    it("remove deve deletar o vínculo", async () => {
        const created = await psRepository.create({ professorId, subjectId })
        const removed = await psRepository.remove(created.id)
        expect(removed.id).toBe(created.id)
        const found = await psRepository.findById(created.id)
        expect(found).toBeUndefined()
    })

    it("findAverage deve retornar estrutura correta para ID inexistente", async () => {
        const result = await psRepository.findAverage("00000000-0000-0000-0000-000000000000")
        expect(result).toHaveProperty("professorSubjectId")
        expect(result).toHaveProperty("average")
        expect(result).toHaveProperty("count")
        expect(result.count).toBe(0)
    })
})
```

- [ ] **Step 5: Create ProfessorSubjectServices.ts**

```typescript
import * as psRepository from "#http/professor-subject/repository/professorSubjectRepository.ts"
import { NotFoundError } from "#errors/notFoundError.ts"
import { ConflictError } from "#errors/conflictError.ts"

export const findAll = async (filters?: { professorId?: string; subjectId?: string }) => {
    return await psRepository.findAll(filters)
}

export const findById = async (id: string) => {
    const result = await psRepository.findById(id)
    if (!result) throw new NotFoundError("Vínculo não encontrado.")
    return result
}

export const create = async (data: { professorId: string; subjectId: string }) => {
    try {
        return await psRepository.create(data)
    } catch (error: any) {
        if (error?.code === "23505") {
            throw new ConflictError("Este vínculo professor-matéria já existe.")
        }
        throw error
    }
}

export const remove = async (id: string) => {
    const link = await psRepository.findById(id)
    if (!link) throw new NotFoundError("Vínculo não encontrado.")
    return await psRepository.remove(id)
}

export const findAverage = async (id: string) => {
    const link = await psRepository.findById(id)
    if (!link) throw new NotFoundError("Vínculo não encontrado.")
    return await psRepository.findAverage(id)
}
```

- [ ] **Step 6: Create ProfessorSubjectRoutes.ts**

```typescript
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as psService from "#http/professor-subject/services/ProfessorSubjectServices.ts";
import { professorSubjectSchema, averageSchema } from "#http/professor-subject/schemas/ProfessorSubjectSchema.ts";
import z from "zod";

const prefix = "/professor-subject"

export const professorSubjectRoutes: FastifyPluginAsyncZod = async (server) => {
    server.get(prefix, {
        schema: {
            querystring: z.object({
                professorId: z.string().optional(),
                subjectId: z.string().optional(),
            }),
            response: { 200: z.array(professorSubjectSchema) }
        }
    }, async (request) => {
        const query = request.query as { professorId?: string; subjectId?: string }
        return await psService.findAll(query)
    })

    server.get(`${prefix}/:id`, {
        schema: { response: { 200: professorSubjectSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await psService.findById(id)
    })

    server.get(`${prefix}/:id/average`, {
        schema: { response: { 200: averageSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await psService.findAverage(id)
    })

    server.post(prefix, {
        schema: {
            body: professorSubjectSchema.omit({ id: true }),
            response: { 201: professorSubjectSchema }
        }
    }, async (request, reply) => {
        const data = request.body as { professorId: string; subjectId: string }
        const result = await psService.create(data)
        reply.status(201)
        return result
    })

    server.delete(`${prefix}/:id`, {
        schema: { response: { 200: professorSubjectSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await psService.remove(id)
    })
}
```

- [ ] **Step 7: Run tests**

Run: `npx vitest run src/http/professor-subject/repository/tests/professorSubjectRepository.test.ts`
Expected: 6 tests pass

---

### Task 4: Create Ratings CRUD

**Files:**
- Create: `src/http/ratings/schemas/RatingSchema.ts`
- Create: `src/http/ratings/repository/ratingRepository.ts`
- Create: `src/http/ratings/repository/tests/ratingRepository.test.ts`
- Create: `src/http/ratings/services/RatingServices.ts`
- Create: `src/http/ratings/route/RatingRoutes.ts`

- [ ] **Step 1: Create directory structure**

Run:
```
mkdir -p src/http/ratings/schemas
mkdir -p src/http/ratings/repository/tests
mkdir -p src/http/ratings/services
mkdir -p src/http/ratings/route
```

- [ ] **Step 2: Create RatingSchema.ts**

```typescript
import z from "zod";

export const ratingSchema = z.object({
    id: z.string(),
    value: z.number().min(1).max(5),
    comment: z.string().max(255).nullable(),
    createdAt: z.string(),
    professorSubjectId: z.string(),
});
```

- [ ] **Step 3: Create ratingRepository.ts**

```typescript
import { db } from "#db/connection.ts"
import { schema } from "#db/schemas/index.ts"
import { eq } from "drizzle-orm"

export const findAll = async (filters?: { professorSubjectId?: string }) => {
    const query = db.select().from(schema.ratings)
    if (filters?.professorSubjectId) {
        query.where(eq(schema.ratings.professorSubjectId, filters.professorSubjectId))
    }
    return await query
}

export const findById = async (id: string) => {
    const [result] = await db.select().from(schema.ratings).where(eq(schema.ratings.id, id))
    return result
}

export const create = async (data: { value: number; comment?: string | null; professorSubjectId: string }) => {
    const [result] = await db.insert(schema.ratings).values(data).returning()
    return result
}

export const update = async (id: string, data: { value?: number; comment?: string | null }) => {
    const [result] = await db.update(schema.ratings).set(data).where(eq(schema.ratings.id, id)).returning()
    return result
}

export const remove = async (id: string) => {
    const [result] = await db.delete(schema.ratings).where(eq(schema.ratings.id, id)).returning()
    return result
}
```

- [ ] **Step 4: Create ratingRepository.test.ts**

```typescript
import { describe, it, expect } from "vitest"
import * as ratingRepository from "#http/ratings/repository/ratingRepository.ts"
import * as professorRepository from "#http/professor/repository/professorRepository.ts"
import * as subjectRepository from "#http/subjects/repository/subjectRepository.ts"
import * as psRepository from "#http/professor-subject/repository/professorSubjectRepository.ts"

describe("RatingRepository", () => {
    let psId: string
    let profId: string
    let subjId: string

    beforeEach(async () => {
        const prof = await professorRepository.create({ name: "Prof Avaliado" })
        profId = prof.id
        const subj = await subjectRepository.create({ name: "Matéria Avaliada", semester: 1 })
        subjId = subj.id
        const link = await psRepository.create({ professorId: profId, subjectId: subjId })
        psId = link.id
    })

    afterEach(async () => {
        await psRepository.remove(psId).catch(() => {})
        await professorRepository.remove(profId).catch(() => {})
        await subjectRepository.remove(subjId).catch(() => {})
    })

    it("findAll deve retornar array", async () => {
        const result = await ratingRepository.findAll()
        expect(Array.isArray(result)).toBe(true)
    })

    it("findById deve retornar undefined para ID inexistente", async () => {
        const result = await ratingRepository.findById("00000000-0000-0000-0000-000000000000")
        expect(result).toBeUndefined()
    })

    it("create deve inserir avaliação", async () => {
        const result = await ratingRepository.create({ value: 5, professorSubjectId: psId })
        expect(result).toBeDefined()
        expect(result.value).toBe(5)
        expect(result.professorSubjectId).toBe(psId)
        await ratingRepository.remove(result.id)
    })

    it("create com comment deve salvar comentário", async () => {
        const result = await ratingRepository.create({ value: 3, comment: "Bom professor", professorSubjectId: psId })
        expect(result.comment).toBe("Bom professor")
        await ratingRepository.remove(result.id)
    })

    it("update deve modificar value", async () => {
        const created = await ratingRepository.create({ value: 2, professorSubjectId: psId })
        const updated = await ratingRepository.update(created.id, { value: 4 })
        expect(updated.value).toBe(4)
        await ratingRepository.remove(created.id)
    })

    it("remove deve deletar avaliação", async () => {
        const created = await ratingRepository.create({ value: 1, professorSubjectId: psId })
        await ratingRepository.remove(created.id)
        const found = await ratingRepository.findById(created.id)
        expect(found).toBeUndefined()
    })

    it("findAll com filtro professorSubjectId", async () => {
        const created = await ratingRepository.create({ value: 5, professorSubjectId: psId })
        const result = await ratingRepository.findAll({ professorSubjectId: psId })
        expect(result.some(r => r.id === created.id)).toBe(true)
        await ratingRepository.remove(created.id)
    })
})
```

- [ ] **Step 5: Create RatingServices.ts**

```typescript
import * as ratingRepository from "#http/ratings/repository/ratingRepository.ts"
import { NotFoundError } from "#errors/notFoundError.ts"
import { BadRequestError } from "#errors/badRequestError.ts"

export const findAll = async (filters?: { professorSubjectId?: string }) => {
    return await ratingRepository.findAll(filters)
}

export const findById = async (id: string) => {
    const rating = await ratingRepository.findById(id)
    if (!rating) throw new NotFoundError("Avaliação não encontrada.")
    return rating
}

export const create = async (data: { value: number; comment?: string | null; professorSubjectId: string }) => {
    if (data.value < 1 || data.value > 5) {
        throw new BadRequestError("A nota deve ser entre 1 e 5.")
    }
    return await ratingRepository.create(data)
}

export const update = async (id: string, data: { value?: number; comment?: string | null }) => {
    const rating = await ratingRepository.findById(id)
    if (!rating) throw new NotFoundError("Avaliação não encontrada.")
    if (data.value !== undefined && (data.value < 1 || data.value > 5)) {
        throw new BadRequestError("A nota deve ser entre 1 e 5.")
    }
    return await ratingRepository.update(id, data)
}

export const remove = async (id: string) => {
    const rating = await ratingRepository.findById(id)
    if (!rating) throw new NotFoundError("Avaliação não encontrada.")
    return await ratingRepository.remove(id)
}
```

- [ ] **Step 6: Create RatingRoutes.ts**

```typescript
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import * as ratingService from "#http/ratings/services/RatingServices.ts";
import { ratingSchema } from "#http/ratings/schemas/RatingSchema.ts";
import z from "zod";

const prefix = "/ratings"

export const ratingRoutes: FastifyPluginAsyncZod = async (server) => {
    server.get(prefix, {
        schema: {
            querystring: z.object({
                professorSubjectId: z.string().optional(),
            }),
            response: { 200: z.array(ratingSchema) }
        }
    }, async (request) => {
        const query = request.query as { professorSubjectId?: string }
        return await ratingService.findAll(query)
    })

    server.get(`${prefix}/:id`, {
        schema: { response: { 200: ratingSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await ratingService.findById(id)
    })

    server.post(prefix, {
        schema: {
            body: ratingSchema.omit({ id: true, createdAt: true }),
            response: { 201: ratingSchema }
        }
    }, async (request, reply) => {
        const data = request.body as { value: number; comment?: string | null; professorSubjectId: string }
        const rating = await ratingService.create(data)
        reply.status(201)
        return rating
    })

    server.put(`${prefix}/:id`, {
        schema: {
            body: ratingSchema.omit({ id: true, createdAt: true }).partial(),
            response: { 200: ratingSchema }
        }
    }, async (request) => {
        const { id } = request.params as { id: string }
        const data = request.body as { value?: number; comment?: string | null }
        return await ratingService.update(id, data)
    })

    server.delete(`${prefix}/:id`, {
        schema: { response: { 200: ratingSchema } }
    }, async (request) => {
        const { id } = request.params as { id: string }
        return await ratingService.remove(id)
    })
}
```

- [ ] **Step 7: Run tests**

Run: `npx vitest run src/http/ratings/repository/tests/ratingRepository.test.ts`
Expected: 7 tests pass

---

### Task 5: Register all new routes in server.ts

**Files:**
- Modify: `src/server.ts`

- [ ] **Step 1: Read current server.ts**

- [ ] **Step 2: Add imports and registrations**

Add these imports (with didactic comments):

```typescript
import { getProfessor } from "#http/professor/route/ProfessorRoutes.ts";
import { subjectRoutes } from "#http/subjects/route/SubjectRoutes.ts";
import { professorSubjectRoutes } from "#http/professor-subject/route/ProfessorSubjectRoutes.ts";
import { ratingRoutes } from "#http/ratings/route/RatingRoutes.ts";
```

Add these registrations (before `server.listen`):

```typescript
server.register(getProfessor);
server.register(subjectRoutes);
server.register(professorSubjectRoutes);
server.register(ratingRoutes);
```

- [ ] **Step 3: Run all tests to verify everything works together**

Run: `npx vitest run`
Expected: All test files pass (professor: 5, subjects: 5, professor-subject: 6, ratings: 7 = 23 tests total)

---

### Task 6: Create .http files for manual testing

- [ ] **Step 1: Create/update .http files under each entity folder**

Create `src/http/subjects/subjects.http`:

```http
@baseSubjectsUrl = http://localhost:3333/subjects

GET {{baseSubjectsUrl}}
###

GET {{baseSubjectsUrl}}/ID_AQUI
###

POST {{baseSubjectsUrl}}
Content-Type: application/json

{
    "name": "Matemática",
    "semester": 1
}
###

PUT {{baseSubjectsUrl}}/ID_AQUI
Content-Type: application/json

{
    "name": "Matemática Avançada"
}
###

DELETE {{baseSubjectsUrl}}/ID_AQUI
```

Create `src/http/professor-subject/professor-subject.http`:

```http
@baseUrl = http://localhost:3333/professor-subject

GET {{baseUrl}}
###

GET {{baseUrl}}?professorId=ID_AQUI
###

GET {{baseUrl}}/ID_AQUI
###

GET {{baseUrl}}/ID_AQUI/average
###

POST {{baseUrl}}
Content-Type: application/json

{
    "professorId": "ID_AQUI",
    "subjectId": "ID_AQUI"
}
###

DELETE {{baseUrl}}/ID_AQUI
```

Create `src/http/ratings/ratings.http`:

```http
@baseRatingsUrl = http://localhost:3333/ratings

GET {{baseRatingsUrl}}
###

GET {{baseRatingsUrl}}?professorSubjectId=ID_AQUI
###

GET {{baseRatingsUrl}}/ID_AQUI
###

POST {{baseRatingsUrl}}
Content-Type: application/json

{
    "value": 5,
    "comment": "Excelente professor!",
    "professorSubjectId": "ID_AQUI"
}
###

PUT {{baseRatingsUrl}}/ID_AQUI
Content-Type: application/json

{
    "value": 4,
    "comment": "Muito bom"
}
###

DELETE {{baseRatingsUrl}}/ID_AQUI
```

Update `src/http/professor/professor.http`:

```http
@baseProfessorUrl = http://localhost:3333/professor

GET {{baseProfessorUrl}}
###

GET {{baseProfessorUrl}}/ID_AQUI
###

POST {{baseProfessorUrl}}
Content-Type: application/json

{
    "name": "Novo Professor"
}
###

PUT {{baseProfessorUrl}}/ID_AQUI
Content-Type: application/json

{
    "name": "Nome Atualizado"
}
###

DELETE {{baseProfessorUrl}}/ID_AQUI
```
