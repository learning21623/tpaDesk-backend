import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Role1764572551941 implements MigrationInterface {

   public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "role",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", isUnique: true },
          { name: "description", type: "varchar", isNullable: true },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );
  }
  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("role");
  }

}
