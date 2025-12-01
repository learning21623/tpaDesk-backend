import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Patient } from "./Patient";
import { Staff } from "./Staff";

@Entity()
export class PatientDocument {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @Column()
  uploadedByStaffId!: number;

  @Column()
  fileName!: string;

  @Column()
  filePath!: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patientId" })
  patient!: Patient;

  @ManyToOne(() => Staff)
  @JoinColumn({ name: "uploadedByStaffId" })
  uploadedBy!: Staff;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
