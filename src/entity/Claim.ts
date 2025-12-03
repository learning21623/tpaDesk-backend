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
import { Policy } from "./Policy";

@Entity({ name: "claims" })
export class Claim {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @Column()
  policyId!: number;

  @Column({ default: "pending" })
  status!: "pending" | "submitted" | "approved" | "rejected";

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Patient)
  @JoinColumn({ name: "patientId" })
  patient!: Patient;

  @ManyToOne(() => Policy)
  @JoinColumn({ name: "policyId" })
  policy!: Policy;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
