import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Policy1764573556982 implements MigrationInterface {

    public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "policy",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },

          { name: "hospitalId", type: "int" },
          { name: "name", type: "varchar" },
          { name: "policyNumber", type: "varchar" },

          { name: "sumInsured", type: "decimal", precision: 12, scale: 2, isNullable: true },
          { name: "premium", type: "decimal", precision: 12, scale: 2, isNullable: true },

          { name: "validFrom", type: "date" },
          { name: "validTo", type: "date" },

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
        onDelete: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("policy");
  }
}
