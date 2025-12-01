import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class User1764572468045 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", length: "150" },
          { name: "email", type: "varchar", length: "150", isUnique: true },
          { name: "password", type: "varchar" },
          { name: "phone", type: "varchar", isNullable: true },
          { name: "isActive", type: "boolean", default: true },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );
  }
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
  }

}
