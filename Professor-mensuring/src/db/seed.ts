// 🌱 SEED
//
// Reseta e popula o banco com dados iniciais de professores,
// matérias, o vínculo entre eles (professor_subject) e algumas
// avaliações (ratings) de exemplo — pelo menos 2 por professor.
//
// ⚠️ Este script APAGA os dados existentes das tabelas envolvidas
// antes de inserir os novos (nessa ordem, por causa das FKs):
// ratings → professor_subject → professor → subjects
//
// Uso: npm run db:seed

import { db } from "#db/connection.ts";
import { schema } from "#db/schemas/index.ts";

const professores = [
    { name: "Lucas Garcia" },
    { name: "Ana Beatriz Souza" },
    { name: "Carlos Eduardo Lima" },
    { name: "Mariana Ferreira" },
    { name: "Rafael Costa" },
    { name: "Juliana Almeida" },
];

const materias = [
    { name: "Programação Web I", semester: 1 },
    { name: "Estrutura de Dados", semester: 2 },
    { name: "Banco de Dados", semester: 2 },
    { name: "Programação Web II", semester: 3 },
    { name: "Engenharia de Software", semester: 3 },
    { name: "Desenvolvimento Mobile", semester: 4 },
    { name: "Projeto Interdisciplinar", semester: 4 },
];

// Quais matérias cada professor leciona (por nome, resolvido para
// id depois que professores e matérias forem inseridos)
const vinculos: Record<string, string[]> = {
    "Lucas Garcia": ["Programação Web I", "Programação Web II"],
    "Ana Beatriz Souza": ["Estrutura de Dados", "Projeto Interdisciplinar"],
    "Carlos Eduardo Lima": ["Banco de Dados"],
    "Mariana Ferreira": ["Engenharia de Software", "Projeto Interdisciplinar"],
    "Rafael Costa": ["Desenvolvimento Mobile"],
    "Juliana Almeida": ["Estrutura de Dados", "Banco de Dados"],
};

// Avaliações de exemplo, por professor + matéria (a matéria precisa
// estar em `vinculos[professor]`). Pelo menos 2 por professor.
const avaliacoes: {
    professor: string;
    materia: string;
    value: number;
    comment?: string;
}[] = [
    { professor: "Lucas Garcia", materia: "Programação Web I", value: 5, comment: "Explica muito bem, aulas dinâmicas." },
    { professor: "Lucas Garcia", materia: "Programação Web II", value: 4, comment: "Bom professor, ritmo um pouco rápido." },

    { professor: "Ana Beatriz Souza", materia: "Estrutura de Dados", value: 5, comment: "Didática excelente, exemplos claros." },
    { professor: "Ana Beatriz Souza", materia: "Projeto Interdisciplinar", value: 4 },

    { professor: "Carlos Eduardo Lima", materia: "Banco de Dados", value: 3, comment: "Conteúdo denso, poderia dar mais exemplos práticos." },
    { professor: "Carlos Eduardo Lima", materia: "Banco de Dados", value: 4, comment: "Melhorou bastante depois da metade do semestre." },

    { professor: "Mariana Ferreira", materia: "Engenharia de Software", value: 5, comment: "Aulas muito organizadas." },
    { professor: "Mariana Ferreira", materia: "Projeto Interdisciplinar", value: 5 },

    { professor: "Rafael Costa", materia: "Desenvolvimento Mobile", value: 4, comment: "Traz projetos reais para a sala." },
    { professor: "Rafael Costa", materia: "Desenvolvimento Mobile", value: 2, comment: "Faltou um pouco de material de apoio." },

    { professor: "Juliana Almeida", materia: "Estrutura de Dados", value: 5, comment: "Referência na matéria." },
    { professor: "Juliana Almeida", materia: "Banco de Dados", value: 4, comment: "Ótima didática, exercícios bem pensados." },
];

async function resetDb() {
    console.log("🧹 Resetando tabelas...");
    // Ordem importa por causa das foreign keys (filhos antes dos pais)
    await db.delete(schema.ratings);
    await db.delete(schema.professorSubject);
    await db.delete(schema.professor);
    await db.delete(schema.subjects);
    console.log("→ Tabelas limpas.");
}

async function seed() {
    console.log("🌱 Iniciando seed...");

    await resetDb();

    console.log(`→ Inserindo ${professores.length} professores...`);
    const professoresInseridos = await db
        .insert(schema.professor)
        .values(professores)
        .returning();

    console.log(`→ Inserindo ${materias.length} matérias...`);
    const materiasInseridas = await db
        .insert(schema.subjects)
        .values(materias)
        .returning();

    const professorIdPorNome = new Map(
        professoresInseridos.map((p) => [p.name, p.id]),
    );
    const materiaIdPorNome = new Map(
        materiasInseridas.map((m) => [m.name, m.id]),
    );

    const professorSubjectRows = Object.entries(vinculos).flatMap(
        ([professorNome, materiasDoProfessor]) => {
            const professorId = professorIdPorNome.get(professorNome);
            if (!professorId) return [];

            return materiasDoProfessor.map((materiaNome) => {
                const subjectId = materiaIdPorNome.get(materiaNome);
                if (!subjectId) {
                    throw new Error(
                        `Matéria "${materiaNome}" não encontrada para vincular a "${professorNome}"`,
                    );
                }
                return { professorId, subjectId };
            });
        },
    );

    console.log(`→ Vinculando ${professorSubjectRows.length} pares professor-matéria...`);
    const vinculosInseridos = await db
        .insert(schema.professorSubject)
        .values(professorSubjectRows)
        .returning();

    // Mapa "professorId::subjectId" -> professorSubject.id, para
    // resolver as avaliações abaixo
    const professorSubjectIdPorPar = new Map(
        vinculosInseridos.map((v) => [`${v.professorId}::${v.subjectId}`, v.id]),
    );

    const ratingRows = avaliacoes.map(({ professor, materia, value, comment }) => {
        const professorId = professorIdPorNome.get(professor);
        const subjectId = materiaIdPorNome.get(materia);
        if (!professorId || !subjectId) {
            throw new Error(`Professor "${professor}" ou matéria "${materia}" não encontrados`);
        }

        const professorSubjectId = professorSubjectIdPorPar.get(`${professorId}::${subjectId}`);
        if (!professorSubjectId) {
            throw new Error(
                `"${professor}" não está vinculado a "${materia}" em \`vinculos\` — adicione o vínculo antes de avaliar.`,
            );
        }

        return { value, comment, professorSubjectId };
    });

    console.log(`→ Inserindo ${ratingRows.length} avaliações...`);
    const ratingsInseridas = await db
        .insert(schema.ratings)
        .values(ratingRows)
        .returning();

    console.log(
        `✅ Seed concluído: ${professoresInseridos.length} professores, ${materiasInseridas.length} matérias, ${vinculosInseridos.length} vínculos e ${ratingsInseridas.length} avaliações criados.`,
    );
    process.exit(0);
}

seed().catch((error) => {
    console.error("❌ Erro ao rodar seed:", error);
    process.exit(1);
});