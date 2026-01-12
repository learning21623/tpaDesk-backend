import { Service } from "typedi";
import AppDataSource from "../config/dbconfig";

import { Staff } from "../entity/Staff";
import { Patient } from "../entity/Patient";
import { PatientAmount } from "../entity/PatientAmount";
import { PatientMedical } from "../entity/PatientMedical";
import { PatientHistory, PatientStatus } from "../entity/PatientHistory";
import { Doctor } from "../entity/Doctor";

@Service()
export class PatientService {
  private patientRepo = AppDataSource.getRepository(Patient);
  private historyRepo = AppDataSource.getRepository(PatientHistory);
  private doctorRepo = AppDataSource.getRepository(Doctor);

  // ================= CREATE (ATOMIC) =================
  async createPatient(body: any, user: any) {
    return AppDataSource.transaction(async (manager) => {
      const staffId = user.staffId;
      if (!staffId) throw new Error("Staff ID missing from token");

      const patient = await manager.save(Patient, {
        hospitalId: user.hospitalId,
        name: body.name,
        phone: body.phone,
        age: body.age,
        gender: body.gender,
        address: body.address,
      });

      await manager.save(PatientAmount, {
        patientId: patient.id,
        initialAmount: body.initialAmount || 0,
      });

      await manager.save(PatientMedical, {
        patientId: patient.id,
        chiefComplaint: body.chiefComplaint,
        diagnosis: body.diagnosis,
        doctorId: body.doctorId || null,
      });

      await manager.save(PatientHistory, {
        patient: { id: patient.id },
        staff: { id: staffId },
        status: body.status || PatientStatus.PROCESS,
        note: body.note || "Patient created",
      });

      return patient;
    });
  }

  // ================= LIST (WITH DOCTOR FILTER) =================
  async listPatients(user: any) {
    const query = this.patientRepo
      .createQueryBuilder("patient")
      .leftJoinAndSelect("patient.medical", "medical")
      .leftJoinAndSelect("patient.amount", "amount")
      .where("patient.hospitalId = :hospitalId", { hospitalId: user.hospitalId });

    // If role is doctor, only show patients assigned to them
    if (user.role === "doctor") {
      query.andWhere("medical.doctorId = :doctorId", { doctorId: user.doctorId });
    }

    return await query.orderBy("patient.createdAt", "DESC").getMany();
  }

  // ================= DETAIL =================
  async getPatientDetail(id: number, user: any) {
    return await this.patientRepo.findOne({
      where: { id, hospitalId: user.hospitalId },
      relations: [
        "amount",
        "medical",
        "medical.doctor",
        "medical.doctor.user",
        "histories",
        "histories.staff",
        "histories.staff.user"
      ],
    });
  }

  // ================= UPDATE BASIC =================
  async updateBasic(id: number, body: any, user: any) {
    const staffId = user.staffId;
    if (!staffId) throw new Error("Staff ID missing from token");

    return AppDataSource.transaction(async (manager) => {
      await manager.update(Patient, { id }, {
        name: body.name,
        phone: body.phone,
        age: body.age,
        gender: body.gender,
        address: body.address
      });

      await manager.save(PatientHistory, {
        patient: { id },
        staff: { id: staffId },
        status: PatientStatus.PENDING,
        note: body.note || "Basic details updated",
      });

      return await manager.findOneBy(Patient, { id });
    });
  }

  // ================= UPDATE AMOUNT =================
  async updateAmount(id: number, body: any, user: any) {
    const staffId = user.staffId;
    if (!staffId) throw new Error("Staff ID missing from token");

    return AppDataSource.transaction(async (manager) => {
      await manager.update(PatientAmount, { patientId: id }, {
        approvalAmount: body.approvalAmount,
        finalAmount: body.finalAmount,
        discount: body.discount,
        receivedAmount: body.receivedAmount
      });

      await manager.save(PatientHistory, {
        patient: { id: id },
        staff: { id: staffId },
        status: PatientStatus.PENDING,
        note: body.note || "Billing/Amount details updated",
      });

      return await manager.findOneBy(PatientAmount, { patientId: id });
    });
  }

  // ================= FETCH DOCTORS =================
  async getDoctorsByHospital(hospitalId: number) {
    return await this.doctorRepo.find({
      where: { hospitalId: hospitalId },
      relations: ["user"],
      select: {
        id: true,
        specialization: true,
        user: { firstName: true, lastName: true }
      }
    });
  }

  // ================= UPDATE MEDICAL =================
  async updateMedical(id: number, body: any, user: any) {
    // If staff logs in, they use staffId. If doctor logs in, we need a way to log history.
    // For now, we use staffId from token or allow null if doctor is updating.
    const actingStaffId = user.staffId; 

    return AppDataSource.transaction(async (manager) => {
      await manager.update(PatientMedical, { patientId: id }, {
        doctorId: body.doctorId,
        treatmentPlan: body.treatmentPlan,
        medications: body.medications,
        testsRecommended: body.testsRecommended,
        followUpDate: body.followUpDate,
        roomNumber: body.roomNumber
      });

      // Only save history if actingStaffId exists (to satisfy not-null constraint)
      if (actingStaffId) {
        await manager.save(PatientHistory, {
          patient: { id: id },
          staff: { id: actingStaffId },
          status: PatientStatus.PROCESS,
          note: body.note || `Medical updated by ${user.role}`,
        });
      }

      return await manager.findOne(PatientMedical, {
        where: { patientId: id },
        relations: ["doctor", "doctor.user"]
      });
    });
  }

  async deletePatient(id: number, user: any) {
    return await this.patientRepo.delete(id);
  }
}