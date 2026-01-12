// src/entity/PatientAmount.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Patient } from "./Patient";

@Entity("patient_amounts")
export class PatientAmount {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @Column("decimal")
  initialAmount!: number;

  @Column("decimal", { nullable: true })
  approvalAmount?: number;

  @Column("decimal", { nullable: true })
  finalAmount?: number;

  @Column("decimal", { nullable: true })
  pendingAmount?: number;

  @Column("decimal", { nullable: true })
  discount?: number;

  @Column("decimal", { nullable: true })
  receivedAmount?: number;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patientId" })
  patient!: Patient;
}
