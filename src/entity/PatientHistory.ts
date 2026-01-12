import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from "typeorm";
import { Patient } from "./Patient";
import { Staff } from "./Staff";

export enum PatientStatus {
  PENDING = "pending",
  PROCESS = "process",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

@Entity("patient_histories")
export class PatientHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Patient, { onDelete: "CASCADE" })
  @JoinColumn({ name: "patientId" })
  patient!: Patient;

  @ManyToOne(() => Staff, { onDelete: "RESTRICT" })
  @JoinColumn({ name: "staffId" })
  staff!: Staff;

  @Column({
    type: "enum",
    enum: PatientStatus,
    default: PatientStatus.PENDING,
  })
  status!: PatientStatus;

  @Column({ type: "text" })
  note!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
