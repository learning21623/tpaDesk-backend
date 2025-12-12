import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { Type } from "class-transformer";

export class DoctorId {
  @Type(() => Number)
  @IsNumber()
  id!: number;
}

export class CreateDoctor {
  // client only sends userId and specialization; hospitalId comes from token
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  specialization!: string;
}

export class UpdateDoctor {
  @IsOptional()
  @IsString()
  @Length(2, 150)
  specialization?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  hospitalId?: number;
}
