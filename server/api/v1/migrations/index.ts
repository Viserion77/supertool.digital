import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

export default defineEventHandler(async (event) => {
  const requestMethod = event.node.req.method;

  switch (requestMethod) {
    case "GET": {
      const migrations = await migrationRunner({
        databaseUrl: process.env.DATABASE_URL ?? "",
        dryRun: true,
        dir: join("infra", "migrations"),
        direction: "up",
        migrationsTable: "pgmigrations",
      });
      return migrations;
    }
    case "POST": {
      const migrations = await migrationRunner({
        databaseUrl: process.env.DATABASE_URL ?? "",
        dryRun: false,
        dir: join("infra", "migrations"),
        direction: "up",
        migrationsTable: "pgmigrations",
      });
      return migrations;
    }
  }

  event.node.res.statusCode = 405;
  return { error: "Method not allowed" };
});
