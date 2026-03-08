import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

import { User } from "./Users";
import { Hospital } from "./Hospital";

@Entity({ name: "doctor" })
export class Doctor {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  hospitalId!: number;

  @Column({ type: "varchar", length: 150 })
  specialization!: string;

  @Column({ type: "varchar", length: 150 })
  department!: string;

  @Column({
    type: "enum",
    enum: ["junior", "senior", "consultant"]
  })
  designation!: string;

  @Column({ type: "varchar", length: 100 })
  registrationNumber!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Hospital)
  @JoinColumn({ name: "hospitalId" })
  hospital!: Hospital;
}