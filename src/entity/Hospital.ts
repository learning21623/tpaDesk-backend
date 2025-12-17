// src/entity/Hospital.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany // 👈 Import this
} from "typeorm";
import { User } from "./Users"; // 👈 Import User entity

@Entity({ name: "hospital" })
export class Hospital {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  contactPerson?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  // 👇 ADD THIS RELATIONSHIP
  @OneToMany(() => User, (user) => user.hospital)
  users!: User[]; 

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}