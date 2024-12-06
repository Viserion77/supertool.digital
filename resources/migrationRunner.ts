import db from "./database";

async function validateMigrationTable(migrationsTable: string) {
  const query = `
    CREATE TABLE IF NOT EXISTS ${migrationsTable} (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      run_on TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
  await db.query(query);
}

export async function migrationRunner({
  dryRun = false,
  migrationsTable = "pgmigrations",
  closeConnection = false,
}) {
  const migrations: {
    [migration: string]: () => string;
  } = await import("./migrations");

  await validateMigrationTable(migrationsTable);
  const currentMigration = await db.query(
    `SELECT * FROM ${migrationsTable} ORDER BY id DESC LIMIT 1`,
  );
  let lastMigration = null;
  if (currentMigration.rows.length) {
    lastMigration = currentMigration.rows[0].name;
  }

  const migrationFiles = Object.keys(migrations).sort();
  const migrationList = [];
  for (const migration of migrationFiles) {
    if (migration <= lastMigration) {
      continue;
    }
    migrationList.push(migration);

    const query = migrations[migration]();
    const result = dryRun ? {} : await db.query(query);
    console.info("migration result", migration, result);

    const runOn = new Date().toISOString();
    await db.query(
      `INSERT INTO ${migrationsTable} (name, run_on) VALUES ('${migration}', '${runOn}')`,
    );
    console.log(`Migração executada: ${migration}`);
  }

  if (closeConnection) {
    await (await db.client).end();
  }
  return migrationList;
}
