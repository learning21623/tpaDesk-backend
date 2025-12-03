import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Hospital1764773354095 implements MigrationInterface {

   public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "hospital",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", length: "255" },
          { name: "address", type: "varchar", isNullable: true },
          { name: "contactPerson", type: "varchar", isNullable: true },
          { name: "phone", type: "varchar", isNullable: true },
          { name: "email", type: "varchar", isNullable: true },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("hospital");
  }

}
