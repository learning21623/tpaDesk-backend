import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  IsIn
} from "class-validator";

import { Type } from "class-transformer";

export class DoctorId {

  @Type(() => Number)
  @IsNumber()
  id!: number;

}

export class CreateDoctor {

  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @IsString()
  @IsNotEmpty()
  @Length(2,150)
  specialization!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2,150)
  department!: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(["junior","senior","consultant"])
  designation!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2,100)
  registrationNumber!: string;
}

export class UpdateDoctor {

  @IsOptional()
  @IsString()
  @Length(2,150)
  specialization?: string;

  @IsOptional()
  @IsString()
  @Length(2,150)
  department?: string;

  @IsOptional()
  @IsString()
  @IsIn(["junior","senior","consultant"])
  designation?: string;

  @IsOptional()
  @IsString()
  @Length(2,100)
  registrationNumber?: string;
}