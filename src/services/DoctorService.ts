import { Service, Inject } from "typedi";
import AppDataSource from "../config/dbconfig";
import { Repository } from "typeorm";
import { Doctor } from "../entity/Doctor";
import { ApiError } from "../utils/Apierror";
import httpStatus from "http-status";

import { UserService } from "./UserService";
import { HospitalService } from "./HospitalService";

@Service()
export class DoctorService {
  private doctorRepo: Repository<Doctor>;

  constructor(
    @Inject(() => UserService)
    private readonly userService: UserService,

    @Inject(() => HospitalService)
    private readonly hospitalService: HospitalService
  ) {
    this.doctorRepo = AppDataSource.getRepository(Doctor);
  }

  // CREATE DOCTOR
  async createDoctor(data: any) {
    const { userId, hospitalId, specialization } = data;

    const user = await this.userService.fetchDetails({ id: userId });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    const hospital = await this.hospitalService.fetchDetails({ id: hospitalId });
    if (!hospital) throw new ApiError(httpStatus.NOT_FOUND, "Hospital not found");

    const existing = await this.doctorRepo.findOne({ where: { userId } });
    if (existing) throw new ApiError(httpStatus.CONFLICT, "Doctor already exists");

    const doctor = this.doctorRepo.create({
      userId,
      hospitalId,
      specialization
    });

    return await this.doctorRepo.save(doctor);
  }

  // LIST
  async fetchDoctors() {
    return await this.doctorRepo.find({
      relations: ["user", "hospital"]
    });
  }

  // DETAILS
  async fetchDetails(id: number) {
    return await this.doctorRepo.findOne({
      where: { id },
      relations: ["user", "hospital"]
    });
  }

  // UPDATE
  async updateDoctor(id: number, data: any) {
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");

    Object.assign(doctor, data);
    await this.doctorRepo.save(doctor);

    return this.fetchDetails(id);
  }

  // DELETE
  async deleteDoctor(id: number) {
    const doctor = await this.doctorRepo.findOne({ where: { id } });
    if (!doctor) throw new ApiError(httpStatus.NOT_FOUND, "Doctor not found");

    await this.doctorRepo.remove(doctor);
    return doctor;
  }
}
