import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class PatientHistories1767799358185
  implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "patient_histories",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "patientId", type: "int" },
          { name: "staffId", type: "int" },
          {
            name: "status",
            type: "enum",
            enum: ["process", "pending", "accepted", "rejected"],
          },
          { name: "note", type: "text", isNullable: true },
          { name: "reason", type: "text", isNullable: true },
          {
            name: "createdAt",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      })
    );

    await q.createForeignKey(
      "patient_histories",
      new TableForeignKey({
        columnNames: ["patientId"],
        referencedTableName: "patients",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await q.createForeignKey(
      "patient_histories",
      new TableForeignKey({
        columnNames: ["staffId"],
        referencedTableName: "staff",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("patient_histories");
  }
}
