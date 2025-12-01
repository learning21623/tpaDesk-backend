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
import { SubscriptionPlan } from "./SubscriptionPlan";

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  hospitalId!: number;

  @Column()
  planId!: number;

  @Column()
  startedAt!: Date;

  @Column()
  expiresAt!: Date;

  @ManyToOne(() => Hospital)
  @JoinColumn({ name: "hospitalId" })
  hospital!: Hospital;

  @ManyToOne(() => SubscriptionPlan)
  @JoinColumn({ name: "planId" })
  plan!: SubscriptionPlan;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
