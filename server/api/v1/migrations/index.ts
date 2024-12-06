import database from "~/resources/database";
import { migrationRunner } from "~/resources/migrationRunner";

export default defineEventHandler(async (event) => {
  const client = await database.client;
  const requestMethod = event.node.req.method;
  const configuration = {
    dbClient: client,
    dryRun: true,
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
