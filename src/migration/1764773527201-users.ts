import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class Users1764773527201 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "firstName", type: "varchar", length: "100" },
          { name: "lastName", type: "varchar", length: "100" },
          { name: "email", type: "varchar", isUnique: true },
          { name: "password", type: "varchar" },
          { name: "mobile", type: "varchar", length: "15", isNullable: true },
          { name: "roleId", type: "int" },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await queryRunner.createForeignKey(
      "users",
      new TableForeignKey({
        columnNames: ["roleId"],
        referencedTableName: "roles",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("users");
    const fk = table!.foreignKeys.find(f => f.columnNames.indexOf("roleId") !== -1);
    if (fk) await queryRunner.dropForeignKey("users", fk);
    await queryRunner.dropTable("users");
  }

}
