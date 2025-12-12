import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Role } from "./Roles";
import { Hospital } from "./Hospital"; // <-- Import Hospital entity

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  firstName!: string;

  @Column({ length: 100 })
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true, length: 15 })
  mobile?: string;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: "SET NULL" })
  @JoinColumn({ name: "roleId" })
  role!: Role;

  @Column({ nullable: true })
  roleId!: number;

  // New fields for Hospital relationship
  @ManyToOne(() => Hospital, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "hospitalId" })
  hospital?: Hospital; // Optional relation

  @Column({ nullable: true })
  hospitalId?: number; // Optional column

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}