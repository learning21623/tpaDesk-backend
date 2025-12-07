import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
  IsDefined
} from "class-validator";

export class CreateHospital {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateHospital {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}


export class HospitalId {
  @IsDefined() // Example decorator usage on the validation class
  @IsNumber()
  id: number; 
}
