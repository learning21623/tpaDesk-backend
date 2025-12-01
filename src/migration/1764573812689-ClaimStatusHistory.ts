import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ClaimStatusHistory1764573812689 implements MigrationInterface {

    public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "claim_status_history",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            isPrimary: true,
            generationStrategy: "increment"
          },

          { name: "claimId", type: "int" },
          { name: "status", type: "varchar" },
          { name: "note", type: "text", isNullable: true },

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
        onDelete: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("claim_status_history");
  }

}
