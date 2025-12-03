import { MigrationInterface, QueryRunner, TableForeignKey,Table } from "typeorm";

export class Doctor1764773591025 implements MigrationInterface {

    public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "doctor",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "userId", type: "int" },
          { name: "hospitalId", type: "int" },
          { name: "specialization", type: "varchar", length: "150" },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKey(
      "doctor",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );

    await q.createForeignKey(
      "doctor",
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
    const table = await q.getTable("doctor");
    const fk1 = table!.foreignKeys.find(f => f.columnNames.indexOf("userId") !== -1);
    if (fk1) await q.dropForeignKey("doctor", fk1);
    const fk2 = table!.foreignKeys.find(f => f.columnNames.indexOf("hospitalId") !== -1);
    if (fk2) await q.dropForeignKey("doctor", fk2);
    await q.dropTable("doctor");
  }

}
