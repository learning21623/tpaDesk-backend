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

export enum PatientDocumentType {
  PAN = "PAN",
  AADHAR = "AADHAR",
  POLICY = "POLICY",
  OTHER = "OTHER",
}

@Entity({ name: "patient_documents" })
export class PatientDocument {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @Column()
  uploadedByStaffId!: number;

  @Column({
    type: "enum",
    enum: PatientDocumentType,
  })
  documentType!: PatientDocumentType;

  @Column()
  fileName!: string;

  @Column()
  filePath!: string;

  @ManyToOne(() => Patient, { onDelete: "CASCADE" })
  @JoinColumn({ name: "patientId" })
  patient!: Patient;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: "uploadedByStaffId" })
  uploadedBy!: Staff;

  @CreateDateColumn()
  createdAt!: Date;
}
