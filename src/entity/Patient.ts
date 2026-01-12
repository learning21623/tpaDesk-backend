import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { PatientHistory } from "./PatientHistory";
import { PatientAmount } from "./PatientAmount";
import { PatientMedical } from "./PatientMedical";
import { PatientDocument } from "./PatientDocument";

@Entity("patients")
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  hospitalId!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  gender?: string;

  @Column({ nullable: true })
  address?: string;

  @OneToMany(() => PatientHistory, (h) => h.patient)
  histories!: PatientHistory[];

  @OneToMany(() => PatientAmount, (a) => a.patient)
  amount!: PatientAmount[];

  @OneToMany(() => PatientMedical, (m) => m.patient)
  medical!: PatientMedical[];

  @OneToMany(() => PatientDocument, (d) => d.patient)
  documents!: PatientDocument[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}