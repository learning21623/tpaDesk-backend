import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateRole {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateRole {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class RoleId {
  @IsNotEmpty()
  id: number;
}
