import fs from "node:fs/promises";
import db from "./database";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();
const MIGRATIONS_TABLE = "own_migrations_script";

/**
 * Função chamada pelo terminal para criar um novo arquivo de migração e editar o arquivo de migrações para executar 'stepper.ts'
 * @example
 * script: migration:create: 'node resources/migration.ts create'
 * "npm run migration:create teste"
 */
export async function create(name: string) {
  if (!name) {
    console.error("Nome da migração não informado");
    return;
  }

  const now = new Date().getTime();
  const migrationName = `${now}_${name}`;
  const migrationPath = `resources/migrations/${migrationName}.ts`;
  const migrationContent = `/**
 * ${migrationName}
 */
export function up${now}() {
  // Return your migration SQL
  return \`
    -- SQL
\`;
}
`;

  await fs.writeFile(migrationPath, migrationContent);
  console.log(`Migração criada com sucesso: ${migrationPath}`);

  const migrationIndex = `export * from "./${migrationName}";\n`;
  await fs.appendFile("resources/migrations/index.ts", migrationIndex);

  console.log(`Migração adicionada ao index: ${migrationIndex}`);
}

if (process.argv[2] === "create") {
  const name = process.argv[3];
  await create(name);
}

async function validateMigrationTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    )
  `;
  await db.query(query);
}

/**
 * Função chamada pelo terminal para executar a migração de fato
 * @example
 * script: migration:up: 'node resources/migration.ts up'
 * "npm run migration:up"
 */
export async function up(closeConnection = false) {
  const migrations: {
    [migration: string]: () => string;
  } = await import("./migrations");
  const client = await db.client;

  await validateMigrationTable();
  const currentMigration = await db.query(
    `SELECT * FROM ${MIGRATIONS_TABLE} ORDER BY id DESC LIMIT 1`,
  );
  let lastMigration = null;
  if (currentMigration.rows.length) {
    lastMigration = currentMigration.rows[0].name;
  }

  const migrationFiles = Object.keys(migrations).sort();
  for (const migration of migrationFiles) {
    if (migration <= lastMigration) {
      continue;
    }

    const query = migrations[migration]();
    await db.query(query);
    await db.query(
      `INSERT INTO ${MIGRATIONS_TABLE} (name) VALUES ('${migration}')`,
    );
    console.log(`Migração executada: ${migration}`);
  }

  if (closeConnection) {
    await client.end();
  }
}

if (process.argv[2] === "up") {
  await up(true);
}
