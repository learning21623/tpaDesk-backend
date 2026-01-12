import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class Patient1764773721855 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "patients",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "hospitalId", type: "int" },
          { name: "name", type: "varchar", length: "255" },
          { name: "phone", type: "varchar", length: "20", isNullable: true },
          { name: "age", type: "int", isNullable: true },
          { name: "gender", type: "varchar", length: "20", isNullable: true },
          { name: "address", type: "varchar", length: "255", isNullable: true },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updatedAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await q.createForeignKey(
      "patients",
      new TableForeignKey({
        columnNames: ["hospitalId"],
        referencedTableName: "hospital",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("patients");
    if (table) {
      for (const fk of table.foreignKeys) {
        await q.dropForeignKey("patients", fk);
      }
    }
    await q.dropTable("patients");
  }
}
