import { MigrationInterface, QueryRunner , Table , TableForeignKey} from "typeorm";

export class Claim1764573755332 implements MigrationInterface {

   public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "claim",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment"
          },

          { name: "patientId", type: "int" },
          { name: "policyId", type: "int" },
          { name: "hospitalId", type: "int" },

          { name: "chiefComplaint", type: "varchar", isNullable: true },
          { name: "diagnosis", type: "varchar", isNullable: true },
          { name: "roomNumber", type: "varchar", isNullable: true },

          { name: "initialAmount", type: "decimal", precision: 12, scale: 2, isNullable: true },
          { name: "approvalAmount", type: "decimal", precision: 12, scale: 2, isNullable: true },
          { name: "finalApprovalAmount", type: "decimal", precision: 12, scale: 2, isNullable: true },
          { name: "pendingAmount", type: "decimal", precision: 12, scale: 2, isNullable: true },
          { name: "discount", type: "decimal", precision: 12, scale: 2, isNullable: true },
          { name: "finalAmountReceived", type: "decimal", precision: 12, scale: 2, isNullable: true },

          { name: "status", type: "varchar", default: "'PENDING'" },

          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKeys("claim", [
      new TableForeignKey({
        columnNames: ["patientId"],
        referencedTableName: "patient",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      }),
      new TableForeignKey({
        columnNames: ["policyId"],
        referencedTableName: "policy",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      }),
      new TableForeignKey({
        columnNames: ["hospitalId"],
        referencedTableName: "hospital",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    ]);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("claim");
  }

}
