import { MigrationInterface, QueryRunner, Table,  TableForeignKey } from "typeorm";

export class Patient1764573619406 implements MigrationInterface {

    public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "patient",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },

          { name: "hospitalId", type: "int" },

          { name: "name", type: "varchar" },
          { name: "age", type: "int", isNullable: true },
          { name: "gender", type: "varchar", isNullable: true },

          { name: "contactNumber", type: "varchar", isNullable: true },
          { name: "address", type: "varchar", isNullable: true },

          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKey(
      "patient",
      new TableForeignKey({
        columnNames: ["hospitalId"],
        referencedTableName: "hospital",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("patient");
  }

}
