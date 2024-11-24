import migrationRunner from "node-pg-migrate";
import { RunnerOptionConfig } from "node-pg-migrate/dist/types";
import { join } from "node:path";

export default defineEventHandler(async (event) => {
  const requestMethod = event.node.req.method;
  const configuration: RunnerOptionConfig & { databaseUrl: string } = {
    databaseUrl: process.env.DATABASE_URL ?? "",
    dryRun: true,
    dir: join("resources", "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
  }

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
