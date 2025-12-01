import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from "typeorm";
import { Claim } from "./Claim";
import { User } from "./Users";

@Entity()
export class ClaimStatusHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  claimId!: number;

  @Column()
  changedByUserId!: number;

  @Column()
  oldStatus!: string;

  @Column()
  newStatus!: string;

  @ManyToOne(() => Claim)
  @JoinColumn({ name: "claimId" })
  claim!: Claim;

  @ManyToOne(() => User)
  @JoinColumn({ name: "changedByUserId" })
  changedBy!: User;

  @CreateDateColumn()
  createdAt!: Date;
}
