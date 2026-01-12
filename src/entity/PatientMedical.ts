import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Patient } from "./Patient";
import { Doctor } from "./Doctor"; // Import the Doctor entity

@Entity("patient_medical")
export class PatientMedical {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @Column()
  chiefComplaint!: string;

  @Column()
  diagnosis!: string;

  // Change: Store the ID of the doctor
  @Column({ nullable: true })
  doctorId!: number;

  // Change: Add formal relationship to the Doctor table
  @ManyToOne(() => Doctor)
  @JoinColumn({ name: "doctorId" })
  doctor!: Doctor;

  @Column({ nullable: true })
  roomNumber?: string;

  @Column({ type: "text", nullable: true })
  treatmentPlan?: string;

  @Column({ type: "text", nullable: true })
  medications?: string;

  @Column({ type: "text", nullable: true })
  testsRecommended?: string;

  @Column({ type: "date", nullable: true })
  followUpDate?: Date;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patientId" })
  patient!: Patient;
}