import { MigrationInterface, QueryRunner , Table, } from "typeorm";

export class SubscriptionPlan1764573864825 implements MigrationInterface {

   public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "subscription_plan",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            isPrimary: true,
            generationStrategy: "increment"
          },

          { name: "name", type: "varchar" },
          { name: "price", type: "decimal", precision: 10, scale: 2 },
          { name: "durationInMonths", type: "int" },

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
