import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Roles1764773001855 implements MigrationInterface {

  public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "roles",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", length: "50", isUnique: true },
          { name: "description", type: "varchar", isNullable: true },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("roles");
  }

}
