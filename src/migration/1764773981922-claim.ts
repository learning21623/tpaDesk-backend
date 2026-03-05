import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Claim1764773981922 implements MigrationInterface {

  public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "claim",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "patientId", type: "int" },
          { name: "policyId", type: "int" },
          { name: "status", type: "varchar", length: "50", default: "'pending'" },
          { name: "notes", type: "text", isNullable: true },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKey(
      "claim",
      new TableForeignKey({
        columnNames: ["patientId"],
        referencedTableName: "patients",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );

    await q.createForeignKey(
      "claim",
      new TableForeignKey({
        columnNames: ["policyId"],
        referencedTableName: "policy",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("claim");
    const fks = table!.foreignKeys;
    for (const fk of fks) {
      await q.dropForeignKey("claim", fk);
    }
    await q.dropTable("claim");
  }

}
