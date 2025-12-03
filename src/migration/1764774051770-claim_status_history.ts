import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ClaimStatusHistory1764774051770 implements MigrationInterface {

    public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "claim_status_history",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "claimId", type: "int" },
          { name: "changedByUserId", type: "int" },
          { name: "oldStatus", type: "varchar", length: "50" },
          { name: "newStatus", type: "varchar", length: "50" },
          { name: "createdAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKey(
      "claim_status_history",
      new TableForeignKey({
        columnNames: ["claimId"],
        referencedTableName: "claim",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );

    await q.createForeignKey(
      "claim_status_history",
      new TableForeignKey({
        columnNames: ["changedByUserId"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("claim_status_history");
    const fks = table!.foreignKeys;
    for (const fk of fks) {
      await q.dropForeignKey("claim_status_history", fk);
    }
    await q.dropTable("claim_status_history");
  }
}
