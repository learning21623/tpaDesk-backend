import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class UserHospitalId1772726125532 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {

    const table = await queryRunner.getTable("users");

    const columnExists = table?.findColumnByName("hospitalId");

    // ✅ Add column only if it doesn't exist
    if (!columnExists) {
      await queryRunner.addColumn(
        "users",
        new TableColumn({
          name: "hospitalId",
          type: "int",
          isNullable: true
        })
      );
    }

    const updatedTable = await queryRunner.getTable("users");

    const foreignKeyExists = updatedTable?.foreignKeys.find(
      fk => fk.columnNames.indexOf("hospitalId") !== -1
    );

    // ✅ Add FK only if it doesn't exist
    if (!foreignKeyExists) {
      await queryRunner.createForeignKey(
        "users",
        new TableForeignKey({
          columnNames: ["hospitalId"],
          referencedTableName: "hospital",
          referencedColumnNames: ["id"],
          onDelete: "SET NULL"
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {

    const table = await queryRunner.getTable("users");

    const foreignKey = table?.foreignKeys.find(
      fk => fk.columnNames.indexOf("hospitalId") !== -1
    );

    if (foreignKey) {
      await queryRunner.dropForeignKey("users", foreignKey);
    }

    const columnExists = table?.findColumnByName("hospitalId");

    if (columnExists) {
      await queryRunner.dropColumn("users", "hospitalId");
    }
  }
}