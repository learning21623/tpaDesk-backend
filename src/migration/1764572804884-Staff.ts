import { MigrationInterface, QueryRunner ,Table, TableForeignKey } from "typeorm";

export class Staff1764572804884 implements MigrationInterface {

    public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "staff",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },

          { name: "userId", type: "int" },
          { name: "hospitalId", type: "int" },
          { name: "doctorId", type: "int", isNullable: true },

          { name: "staffCode", type: "varchar", isNullable: true },
          { name: "role", type: "varchar", isNullable: true },

          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKeys("staff", [
      new TableForeignKey({
        columnNames: ["userId"],
        referencedTableName: "user",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      }),
      new TableForeignKey({
        columnNames: ["hospitalId"],
        referencedTableName: "hospital",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      }),
      new TableForeignKey({
        columnNames: ["doctorId"],
        referencedTableName: "doctor",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL"
      })
    ]);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("staff");
  }

}
