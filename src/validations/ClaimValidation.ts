import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
  IsDateString,
} from "class-validator";

export class CreateClaim {
  @IsNotEmpty()
  @IsString()
  claimNumber: string;

  @IsNumber()
  policyId: number;

  @IsNumber()
  initiatedById: number;

  @IsIn(["cashless", "reimbursement"])
  claimType: "cashless" | "reimbursement";

  @IsNotEmpty()
  @IsString()
  claimReason: string;

  @IsDateString()
  claimDate: string;

  @IsOptional()
  @IsIn(["initiated", "in_review", "approved", "rejected", "settled"])
  claimStatus?: "initiated" | "in_review" | "approved" | "rejected" | "settled";

  @IsOptional()
  @IsNumber()
  claimedAmount?: number;

  @IsOptional()
  @IsNumber()
  approvedAmount?: number;
}

export class UpdateClaim {
  @IsOptional()
  @IsIn(["cashless", "reimbursement"])
  claimType?: "cashless" | "reimbursement";

  @IsOptional()
  @IsString()
  claimReason?: string;

  @IsOptional()
  @IsDateString()
  claimDate?: string;

  @IsOptional()
  @IsIn(["initiated", "in_review", "approved", "rejected", "settled"])
  claimStatus?: "initiated" | "in_review" | "approved" | "rejected" | "settled";

  @IsOptional()
  @IsNumber()
  claimedAmount?: number;

  @IsOptional()
  @IsNumber()
  approvedAmount?: number;
}

export class ClaimId {
  @IsNotEmpty({ message: "Claim ID is required" })
  @IsNumber({}, { message: "Claim ID must be a number" })
  claimId: number;
}
