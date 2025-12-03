import { MigrationInterface, QueryRunner,Table, TableForeignKey } from "typeorm";

export class Policy1764773789340 implements MigrationInterface {

     public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "policy",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "hospitalId", type: "int" },
          { name: "name", type: "varchar", length: "255" },
          { name: "description", type: "text", isNullable: true },
          { name: "isActive", type: "boolean", default: true },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKey(
      "policy",
      new TableForeignKey({
        columnNames: ["hospitalId"],
        referencedTableName: "hospital",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("policy");
    const fk = table!.foreignKeys.find(f => f.columnNames.indexOf("hospitalId") !== -1);
    if (fk) await q.dropForeignKey("policy", fk);
    await q.dropTable("policy");
  }

}
