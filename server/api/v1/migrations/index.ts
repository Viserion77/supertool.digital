import migrationRunner from "node-pg-migrate";
import { RunnerOptionConfig } from "node-pg-migrate/dist/types";
import { join } from "node:path";
import { Client } from "pg";
import database from "~/resources/database";

export default defineEventHandler(async (event) => {
  const client = await database.client;
  const requestMethod = event.node.req.method;
  const configuration: RunnerOptionConfig & { dbClient: Client } = {
    dbClient: client,
    dryRun: true,
    dir: join("resources", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
  };

  switch (requestMethod) {
    case "GET": {
      const pendingMigrations = await migrationRunner(configuration);
      return pendingMigrations;
    }
    case "POST": {
      const migratedMigrations = await migrationRunner({
        ...configuration,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        event.node.res.statusCode = 201;
      }
      return migratedMigrations;
    }
  }

  event.node.res.statusCode = 405;
  return { error: "Method not allowed" };
});
