import fs from "node:fs/promises";
import db from "./database";
import { migrationRunner } from "./migrationRunner";

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
  await (await db.client).end(); // todo: refatorar
}

if (process.argv[2] === "up") {
  await migrationRunner({ closeConnection: true });
}
