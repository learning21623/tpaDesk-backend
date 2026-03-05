import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class UserHospitalId1772726125532 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.addColumn(
      "users",
      new TableColumn({
        name: "hospitalId",
        type: "int",
        isNullable: true
      })
    );

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

  public async down(queryRunner: QueryRunner): Promise<void> {

    const table = await queryRunner.getTable("users");
    const fk = table!.foreignKeys.find(f => f.columnNames.indexOf("hospitalId") !== -1);

    if (fk) await queryRunner.dropForeignKey("users", fk);

    await queryRunner.dropColumn("users", "hospitalId");

  }

}
