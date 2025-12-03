import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class SubscriptionPlan1764773475741 implements MigrationInterface {

    public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "subscription_plan",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "name", type: "varchar", length: "150" },
          { name: "price", type: "decimal", precision: 12, scale: 2 },
          { name: "durationInDays", type: "int" },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.dropTable("subscription_plan");
  }

}
