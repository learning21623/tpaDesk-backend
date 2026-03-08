import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterDoctor1772935808094 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    const table = await queryRunner.getTable("doctor");

    // ---------------- hospitalId ----------------
    if (!table?.findColumnByName("hospitalId")) {

      await queryRunner.addColumn(
        "doctor",
        new TableColumn({
          name: "hospitalId",
          type: "int",
          isNullable: true
        })
      );

      await queryRunner.createForeignKey(
        "doctor",
        new TableForeignKey({
          columnNames: ["hospitalId"],
          referencedTableName: "hospital",
          referencedColumnNames: ["id"],
          onDelete: "SET NULL"
        })
      );
    }

    // ---------------- department ----------------
    if (!table?.findColumnByName("department")) {

      await queryRunner.addColumn(
        "doctor",
        new TableColumn({
          name: "department",
          type: "varchar",
          length: "150",
          isNullable: true
        })
      );

      await queryRunner.query(`UPDATE doctor SET "department"='General' WHERE "department" IS NULL`);

      await queryRunner.query(`ALTER TABLE doctor ALTER COLUMN "department" SET NOT NULL`);
    }

    // ---------------- designation ----------------
    if (!table?.findColumnByName("designation")) {

      await queryRunner.addColumn(
        "doctor",
        new TableColumn({
          name: "designation",
          type: "enum",
          enum: ["junior", "senior", "consultant"],
          isNullable: true
        })
      );

      await queryRunner.query(`UPDATE doctor SET "designation"='junior' WHERE "designation" IS NULL`);

      await queryRunner.query(`ALTER TABLE doctor ALTER COLUMN "designation" SET NOT NULL`);
    }

    // ---------------- registrationNumber ----------------
    if (!table?.findColumnByName("registrationNumber")) {

      await queryRunner.addColumn(
        "doctor",
        new TableColumn({
          name: "registrationNumber",
          type: "varchar",
          length: "100",
          isNullable: true
        })
      );

      await queryRunner.query(`UPDATE doctor SET "registrationNumber"='TEMP_REG' WHERE "registrationNumber" IS NULL`);

      await queryRunner.query(`ALTER TABLE doctor ALTER COLUMN "registrationNumber" SET NOT NULL`);
    }

  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    const table = await queryRunner.getTable("doctor");

    const fk = table?.foreignKeys.find(fk => fk.columnNames.includes("hospitalId"));

    if (fk) {
      await queryRunner.dropForeignKey("doctor", fk);
    }

    if (table?.findColumnByName("hospitalId")) {
      await queryRunner.dropColumn("doctor", "hospitalId");
    }

    if (table?.findColumnByName("department")) {
      await queryRunner.dropColumn("doctor", "department");
    }

    if (table?.findColumnByName("designation")) {
      await queryRunner.dropColumn("doctor", "designation");
    }

    if (table?.findColumnByName("registrationNumber")) {
      await queryRunner.dropColumn("doctor", "registrationNumber");
    }

  }
}