import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from "typeorm";

export class PatientAmounts1767799054831
    implements MigrationInterface {
    public async up(q: QueryRunner): Promise<void> {
        await q.createTable(
            new Table({
                name: "patient_amounts",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    { name: "patientId", type: "int" },
                    {
                        name: "initialAmount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                    },
                    {
                        name: "approvalAmount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "finalAmount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "pendingAmount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "discount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                    {
                        name: "receivedAmount",
                        type: "decimal",
                        precision: 10,
                        scale: 2,
                        isNullable: true,
                    },
                ],
            })
        );

        await q.createForeignKey(
            "patient_amounts",
            new TableForeignKey({
                columnNames: ["patientId"],
                referencedTableName: "patients",
                referencedColumnNames: ["id"],
                onDelete: "CASCADE",
            })
        );
    }

    public async down(q: QueryRunner): Promise<void> {
        await q.dropTable("patient_amounts");
    }
}
