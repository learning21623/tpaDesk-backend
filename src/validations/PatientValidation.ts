import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsPositive,
} from "class-validator";

/* ================= ENUM ================= */

export enum PatientHistoryStatus {
  PROCESS = "process",
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

/* ================= COMMON ================= */

export class PatientId {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  id!: number;
}

/* ================= CREATE ================= */

export class CreatePatient {
  // ---------- Patient ----------
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;

  // ---------- Amount ----------
  @IsOptional()
  @IsNumber()
  @IsPositive()
  initialAmount?: number;

  // ---------- Medical ----------
  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  // ---------- History ----------
  @IsOptional()
  @IsEnum(PatientHistoryStatus)
  status?: PatientHistoryStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

/* ================= UPDATE BASIC PATIENT ================= */

export class UpdatePatient {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

/* ================= UPDATE AMOUNT ================= */


export class UpdatePatientAmount {
  // REMOVE patientId from here if it exists!

  @IsNumber()
  @IsOptional()
  approvalAmount?: number;

  @IsNumber()
  @IsOptional()
  finalAmount?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsNumber()
  @IsOptional()
  receivedAmount?: number;

  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdatePatientMedical {
  // REMOVE patientId from here if it exists!

  @IsNumber()
  @IsOptional()
  doctorId?: number;

  @IsString()
  @IsOptional()
  treatmentPlan?: string;

  @IsString()
  @IsOptional()
  medications?: string;

  @IsString()
  @IsOptional()
  testsRecommended?: string;

  @IsString()
  @IsOptional()
  followUpDate?: string;

  @IsString()
  @IsOptional()
  roomNumber?: string;

  @IsString()
  @IsOptional()
  note?: string;
}
