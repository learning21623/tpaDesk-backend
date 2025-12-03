import { MigrationInterface, QueryRunner , Table, TableForeignKey} from "typeorm";

export class Patient1764773721855 implements MigrationInterface {

   public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "patient",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "hospitalId", type: "int" },
          { name: "name", type: "varchar", length: "255" },
          { name: "phone", type: "varchar", isNullable: true },
          { name: "age", type: "int", isNullable: true },
          { name: "gender", type: "varchar", isNullable: true },
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
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("patient");
    const fk = table!.foreignKeys.find(f => f.columnNames.indexOf("hospitalId") !== -1);
    if (fk) await q.dropForeignKey("patient", fk);
    await q.dropTable("patient");
  }

}
