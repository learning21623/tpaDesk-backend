// src/services/StaffService.ts

import { Service } from "typedi";
import AppDataSource from "../config/dbconfig";
import { Repository } from "typeorm";
import { Staff } from "../entity/Staff";
import { ApiError } from "../utils/Apierror";
import httpStatus from "http-status";

// 💡 SOLUTION: Import and reference the actual Service classes
import { UserService } from "./UserService"; 
import { HospitalService } from "./HospitalService"; 
import { DoctorService } from "./DoctorService"; 

@Service()
export class StaffService {
  private staffRepo: Repository<Staff>;

  constructor(
    private userService: UserService, // FIX: Used specific class type
    private hospitalService: HospitalService, // FIX: Used specific class type
    private doctorService: DoctorService // FIX: Used specific class type
  ) {
    this.staffRepo = AppDataSource.getRepository(Staff);
  }

  // ======================= CREATE STAFF (C) =======================
  async createStaff(data: any) {
    const { userId, hospitalId, assignedDoctorId } = data;

    // 1. Verify User existence (This line was failing due to undefined userService)
    const user = await this.userService.fetchDetails({ id: userId });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }

    // 2. Verify Hospital existence
    const hospital = await this.hospitalService.fetchDetails({ id: hospitalId });
    if (!hospital) {
      throw new ApiError(httpStatus.NOT_FOUND, "Hospital not found");
    }

    // 3. Verify Assigned Doctor existence (if provided)
    if (assignedDoctorId) {
        const doctor = await this.doctorService.fetchDetails(assignedDoctorId);
        if (!doctor) {
            throw new ApiError(httpStatus.NOT_FOUND, "Assigned Doctor not found");
        }
    }

    // 4. Check for existing Staff profile (one-to-one relationship)
    const existing = await this.staffRepo.findOne({ where: { userId } });
    if (existing) {
      throw new ApiError(httpStatus.CONFLICT, "Staff profile already exists for this user");
    }

    // 5. Create and Save the new Staff record
    const staff = this.staffRepo.create({
      userId,
      hospitalId, 
      assignedDoctorId 
    });

    return await this.staffRepo.save(staff);
  }

  // ======================= LIST STAFF (R) =======================
  async fetchStaff() {
    return await this.staffRepo.find({
      relations: ["user", "hospital", "assignedDoctor"]
    });
  }

  // ... (Other CRUD methods are the same) ...

  // ======================= GET DETAILS (R) =======================
  async fetchDetails(id: number) {
    return await this.staffRepo.findOne({
      where: { id },
      relations: ["user", "hospital", "assignedDoctor"]
    });
  }

  // ======================= UPDATE STAFF (U) =======================
  async updateStaff(id: number, data: any) {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) {
      throw new ApiError(httpStatus.NOT_FOUND, "Staff not found");
    }
    
    // Check if the new assignedDoctorId is valid
    if (data.assignedDoctorId) {
        const doctor = await this.doctorService.fetchDetails(data.assignedDoctorId);
        if (!doctor) {
            throw new ApiError(httpStatus.NOT_FOUND, "Assigned Doctor not found");
        }
    }

    Object.assign(staff, data);
    await this.staffRepo.save(staff);

    return this.fetchDetails(id); 
  }

  // ======================= DELETE STAFF (D) =======================
  async deleteStaff(id: number) {
    const staff = await this.staffRepo.findOne({ where: { id } });
    if (!staff) {
      throw new ApiError(httpStatus.NOT_FOUND, "Staff not found");
    }

    await this.staffRepo.remove(staff);
    return staff;
  }
}