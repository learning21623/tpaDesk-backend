import {
    IsNotEmpty,
    IsEmail,
    IsOptional,
    MaxLength,
    IsNumber,
    Min,
    IsString,
    IsIn,
    IsDateString,
    ValidateIf,
    MinLength,
} from "class-validator";
import validationConstants from "../constant/validationConstants";


export class CreatePolicy {
  @IsOptional()
  policyNumber: string;

  @IsIn(["life", "health", "motor", "property", "crop", "travel"])
  policyType: string;

  @IsNumber()
  userId: number;

  @IsNumber()
  insurerId: number;

  @IsNumber()
  sumAssured: number;

  @IsNumber()
  premium: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsIn(["active", "expired", "cancelled"])
  status?: "active" | "expired" | "cancelled";
}

export class PolicyListing {
  @IsOptional()
  @IsIn(validationConstants.VALIDATE_POLICY.POLICY_LISTING_FILTERS, {
    message: `FilterBy must be one of the following: ${validationConstants.VALIDATE_POLICY.POLICY_LISTING_FILTERS.join(", ")}`,
  })
  filterBy: string;

  @IsOptional()
  @MaxLength(100, { message: validationConstants.MAX_LENGTH })
  @IsString({ message: validationConstants.IS_STRING_TYPE })
  filterValue: string;

  @IsOptional()
  @IsIn(validationConstants.VALIDATE_POLICY.POLICY_LISTING_FILTER_CONDITIONS, {
    message: `FilterCondition must be one of the following: ${validationConstants.VALIDATE_POLICY.POLICY_LISTING_FILTER_CONDITIONS.join(", ")}`,
  })
  filterCondition: string;

  @IsOptional()
  @IsIn(['ASC', 'DESC'], {
    message: validationConstants.LIST.SORT_TYPE_VALID_VALUES.replace("$constraint1", "ASC, DESC"),
  })
  sortType: string;

  @IsOptional()
  @IsIn(validationConstants.VALIDATE_POLICY.POLICY_LISTING_FILTERS, {
    message: validationConstants.LIST.SORT_BY_VALID_VALUES.replace(
      "$constraint1",
      validationConstants.VALIDATE_POLICY.POLICY_LISTING_FILTERS.join(", ")
    ),
  })
  sortBy: string;

  @IsOptional()
  @IsNumber()
  userId: number;

  @IsNotEmpty({ message: validationConstants.LIST.PAGE_REQUIRED })
  @IsNumber()
  @Min(1, { message: "Page must be a positive number" })
  page: number;

  @IsNotEmpty({ message: "Limit is Required" })
  @IsNumber()
  @Min(1, { message: "Limit must be a positive number" })
  limit: number;
}

export class UpdatePolicy {
  @IsOptional()
  @IsString({ message: validationConstants.IS_STRING_TYPE })
  policyNumber?: string;

  @IsOptional()
  @IsIn(['life', 'health', 'motor', 'property', 'crop', 'travel'], {
    message: "PolicyType must be one of: life, health, motor, property, crop, travel",
  })
  policyType?: "life" | "health" | "motor" | "property" | "crop" | "travel";

  @IsOptional()
  @IsNumber({}, { message: validationConstants.IS_NUMBER_TYPE })
  userId?: number;

  @IsOptional()
  @IsNumber({}, { message: validationConstants.IS_NUMBER_TYPE })
  insurerId?: number;

  @IsOptional()
  @IsNumber({}, { message: validationConstants.IS_NUMBER_TYPE })
  @Min(1, { message: "Sum Assured must be greater than 0" })
  sumAssured?: number;

  @IsOptional()
  @IsNumber({}, { message: validationConstants.IS_NUMBER_TYPE })
  @Min(1, { message: "Premium must be greater than 0" })
  premium?: number;

  @IsOptional()
  @IsDateString({}, { message: "Start Date must be a valid ISO date string" })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: "End Date must be a valid ISO date string" })
  endDate?: string;

  @IsOptional()
  @IsIn(['active', 'expired', 'cancelled'], {
    message: "Status must be one of: active, expired, cancelled",
  })
  status?: "active" | "expired" | "cancelled";
}

export class PolicyId {
  @IsNotEmpty({ message: "Policy ID is required" })
  @IsNumber({}, { message: "Policy ID must be a number" })
  policyId: number;
}
