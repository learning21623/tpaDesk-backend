import { MigrationInterface, QueryRunner , Table, TableForeignKey} from "typeorm";

export class Subscription1764774120697 implements MigrationInterface {

     public async up(q: QueryRunner): Promise<void> {
    await q.createTable(
      new Table({
        name: "subscription",
        columns: [
          { name: "id", type: "int", isPrimary: true, isGenerated: true, generationStrategy: "increment" },
          { name: "hospitalId", type: "int" },
          { name: "planId", type: "int" },
          { name: "startedAt", type: "timestamp" },
          { name: "expiresAt", type: "timestamp" },
          { name: "createdAt", type: "timestamp", default: "now()" },
          { name: "updatedAt", type: "timestamp", default: "now()" }
        ]
      })
    );

    await q.createForeignKey(
      "subscription",
      new TableForeignKey({
        columnNames: ["hospitalId"],
        referencedTableName: "hospital",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );

    await q.createForeignKey(
      "subscription",
      new TableForeignKey({
        columnNames: ["planId"],
        referencedTableName: "subscription_plan",
        referencedColumnNames: ["id"],
        onDelete: "RESTRICT",
        onUpdate: "CASCADE"
      })
    );
  }

  public async down(q: QueryRunner): Promise<void> {
    const table = await q.getTable("subscription");
    const fks = table!.foreignKeys;
    for (const fk of fks) {
      await q.dropForeignKey("subscription", fk);
    }
    await q.dropTable("subscription");
  }

}
