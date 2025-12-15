// src/validations/StaffValidation.ts

import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class StaffId {
  @Type(() => Number)
  @IsNumber()
  id!: number;
}

export class CreateStaff {
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  userId!: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  assignedDoctorId?: number;
}

export class UpdateStaff {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  userId?: number; 

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  hospitalId?: number; 

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  assignedDoctorId?: number;
}