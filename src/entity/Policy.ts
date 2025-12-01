import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Hospital } from "./Hospital";

@Entity()
export class Policy {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  hospitalId!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => Hospital)
  @JoinColumn({ name: "hospitalId" })
  hospital!: Hospital;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
