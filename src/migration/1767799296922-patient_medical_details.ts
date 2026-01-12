import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class PatientMedicalDetails1767799296922 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "patient_medical",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "patientId", type: "int" },
          // CHANGED: Removed doctorAssigned (varchar) and added doctorId (int)
          { name: "doctorId", type: "int", isNullable: true }, 
          { name: "chiefComplaint", type: "text", isNullable: true },
          { name: "diagnosis", type: "text", isNullable: true },
          { name: "roomNumber", type: "varchar", length: "50", isNullable: true },
          { name: "treatmentPlan", type: "text", isNullable: true },
          { name: "medications", type: "text", isNullable: true },
          { name: "testsRecommended", type: "text", isNullable: true },
          { name: "followUpDate", type: "date", isNullable: true },
        ],
      })
    );

    // 1. Foreign Key for Patients
    await q.createForeignKey(
      "patient_medical",
      new TableForeignKey({
        columnNames: ["patientId"],
        referencedTableName: "patients",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    // 2. NEW: Foreign Key for Doctors
    await q.createForeignKey(
      "patient_medical",
      new TableForeignKey({
        columnNames: ["doctorId"],
        referencedTableName: "doctor", // Ensure your doctor table is named exactly "doctor"
        referencedColumnNames: ["id"],
        onDelete: "SET NULL", // Better than Cascade so medical records aren't lost if a doctor is deleted
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("patient_medical");
  }
}