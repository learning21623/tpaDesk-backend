import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class PatientDocument1764573692912 implements MigrationInterface {

   public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "patient_document",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },

          { name: "patientId", type: "int" },

          { name: "type", type: "varchar" },
          { name: "filePath", type: "varchar" },

          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKey(
      "patient_document",
      new TableForeignKey({
        columnNames: ["patientId"],
        referencedTableName: "patient",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("patient_document");
  }

}
