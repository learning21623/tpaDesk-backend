import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({ name: "subscription_plans" })
export class SubscriptionPlan {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string; // Basic / Pro / Enterprise

  @Column()
  price!: number;

  @Column()
  durationInDays!: number; // 30, 90, 365

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
