import database from "~/resources/database";
import { migrationRunner } from "~/resources/migrationRunner";

export default defineEventHandler(async (event) => {
  try {
    const client = await database.client;
    if (!client) throw new Error('DATABASE_NOT_CONFIGURED')

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
  } catch (e: any) {
    event.node.res.statusCode = 200;
    return { migrations: [], status: 'unavailable', error: (e && e.message) || 'not configured' }
  }
});
