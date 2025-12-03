import { MigrationInterface, QueryRunner , Table, TableForeignKey} from "typeorm";

export class PatientDocument1764773841506 implements MigrationInterface {

   public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "patient_document",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "patientId", type: "int" },
          { name: "uploadedByStaffId", type: "int" },
          { name: "fileName", type: "varchar", length: "255" },
          { name: "filePath", type: "varchar", length: "1000" },
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
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );

    await q.createForeignKey(
      "patient_document",
      new TableForeignKey({
        columnNames: ["uploadedByStaffId"],
        referencedTableName: "staff",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("patient_document");
    const fks = table!.foreignKeys;
    for (const fk of fks) {
      await q.dropForeignKey("patient_document", fk);
    }
    await q.dropTable("patient_document");
  }

}
