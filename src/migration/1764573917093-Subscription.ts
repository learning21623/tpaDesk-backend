import { MigrationInterface, QueryRunner,Table, TableForeignKey,  } from "typeorm";

export class Subscription1764573917093 implements MigrationInterface {

   public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "subscription",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },

          { name: "hospitalId", type: "int" },
          { name: "planId", type: "int" },

          { name: "startDate", type: "date" },
          { name: "endDate", type: "date" },

          { name: "isActive", type: "bool", default: true },

          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKeys("subscription", [
      new TableForeignKey({
        columnNames: ["hospitalId"],
        referencedTableName: "hospital",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      }),
      new TableForeignKey({
        columnNames: ["planId"],
        referencedTableName: "subscription_plan",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE"
      })
    ]);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("subscription");
  }

}
