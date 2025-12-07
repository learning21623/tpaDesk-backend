/**
 * @author
 * Hospital Service – Handles Hospital CRUD operations
 */

import { Service } from "typedi";
import AppDataSource from "../config/dbconfig";
import { Repository, Like } from "typeorm";
import { Hospital } from "../entity/Hospital"; // **Change 1: Import Hospital entity**
import messages from "../constant/messages";
import { ApiError } from "../utils/Apierror";
import httpStatus from "http-status";

@Service()
export class HospitalService {

  private hospitalRepo: Repository<Hospital>;

  constructor() {
    // **Change 2: Initialize Hospital Repository**
    this.hospitalRepo = AppDataSource.getRepository(Hospital);
  }

  // ======================= CREATE HOSPITAL ============================
  public async createHospitals(data: any) {
    try {
      // Check if a hospital with the same unique field (e.g., name) already exists
      const exists = await this.hospitalRepo.findOne({
        where: { name: data.name }, // **Change 3: Check existence by 'name'**
      });

      if (exists) {
        throw new ApiError(httpStatus.CONFLICT, messages.HOSPITAL.ALREADY_EXISTS);
      }

      // Hospital entity likely doesn't have a password, so skip bcrypt hashing.

      const newHospital = this.hospitalRepo.create(data);
      const savedHospital = await this.hospitalRepo.save(newHospital);

      return savedHospital;

    } catch (error: any) {
      // Use hospital-specific message
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || messages.HOSPITAL.ADD_FAILED
      );
    }
  }

  // ======================= LIST HOSPITALS ============================
  public async fetchHospitals(query: any) {
    let search = query.search || null;

    const condition: any = search
      ? {
          where: [
            { name: Like(`%${search}%`) }, // Search by name
            { city: Like(`%${search}%`) }, // Search by city
            // Add other search fields like address or phone
          ],
          // No relations property added here unless Hospital has relationships
        }
      : {}; // Empty object for no search condition

    const count = await this.hospitalRepo.count(condition);
    const hospitals = await this.hospitalRepo.find(condition);

    return { count, hospitals };
  }

  // ======================= DETAILS ============================
  public async fetchDetails({ id }: { id: number }) {
    // Fetches a single hospital by ID
    const hospital = await this.hospitalRepo.findOne({
      where: { id },
      // Add relations here if Hospital has any (e.g., departments, doctors)
    });

    return hospital || null;
  }

  // ======================= UPDATE HOSPITAL ============================
  public async updateHospital(body: any, { id }: { id: number }) {
    const hospitalToUpdate = await this.hospitalRepo.findOne({
      where: { id },
      // Add relations here if Hospital has any
    });

    if (!hospitalToUpdate) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.HOSPITAL.NOT_FOUND);
    }

    // Duplicate unique field check (e.g., name)
    if (body.name) {
      const exists = await this.hospitalRepo.findOne({
        where: { name: body.name },
      });

      if (exists && exists.id !== id) {
        throw new ApiError(httpStatus.CONFLICT, messages.HOSPITAL.ALREADY_EXISTS);
      }
    }

    // No password handling needed.

    // Merge new data
    Object.assign(hospitalToUpdate, body);

    // Save updated hospital
    await this.hospitalRepo.save(hospitalToUpdate);

    return await this.hospitalRepo.findOne({
      where: { id },
      // Add relations here if Hospital has any
    });
  }

  // ======================= DELETE HOSPITAL ============================
  public async deleteHospital(id: number) {
    const hospital = await this.hospitalRepo.findOne({ where: { id } });

    if (!hospital) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.HOSPITAL.NOT_FOUND);
    }

    try {
      await this.hospitalRepo.remove(hospital);
    } catch (error: any) {
      // Use hospital-specific message
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        messages.HOSPITAL.DELETE_FAILED
      );
    }
  }

  // NOTE: Skipping login function as it's not relevant for a Hospital entity
}