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
import { Doctor } from "./Doctor";
import { Hospital } from "./Hospital";

@Entity({ name: "staff" })
export class Staff {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column()
  hospitalId!: number;

  @Column({ nullable: true })
  assignedDoctorId?: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user!: User;

  @ManyToOne(() => Hospital)
  @JoinColumn({ name: "hospitalId" })
  hospital!: Hospital;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: "assignedDoctorId" })
  assignedDoctor?: Doctor;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
