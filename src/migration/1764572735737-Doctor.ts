import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Doctor1764572735737 implements MigrationInterface {

    public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "doctor",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },

          { name: "userId", type: "int" },
          { name: "hospitalId", type: "int" },

          { name: "specialization", type: "varchar", isNullable: true },
          { name: "doctorCode", type: "varchar", isNullable: true },

          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKeys("doctor", [
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
      })
    ]);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("doctor");
  }

}
