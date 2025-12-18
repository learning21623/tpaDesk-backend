import { Service } from "typedi";
import AppDataSource from "../config/dbconfig";
import { Hospital } from "../entity/Hospital";
import { User } from "../entity/Users";

@Service()
export class HospitalService {
  private repo = AppDataSource.getRepository(Hospital);

  async createHospitals(body: any) {
    // Start a transaction to ensure data integrity
    return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

      // 1. Save the Hospital Record
      const newHospital = transactionalEntityManager.create(Hospital, {
        name: body.name,
        address: body.address,
        contactPerson: body.contactPerson,
        phone: body.phone,
        email: body.email,
      });
      const savedHospital = await transactionalEntityManager.save(newHospital);

      // 2. Automatically Create the Admin User for this Hospital
      // Extracting names from contactPerson for the User record
      const nameParts = body.contactPerson ? body.contactPerson.split(" ") : ["Admin"];
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User";

      const newUser = transactionalEntityManager.create(User, {
        firstName: firstName,
        lastName: lastName,
        email: body.email, // Using hospital email as the default admin login
        password: "Password@123", // Set a default temporary password
        roleId: 2,                // 🔥 Admin Role ID
        hospitalId: savedHospital.id, // Linking to the newly created hospital
        mobile: body.phone
      });

      await transactionalEntityManager.save(newUser);

      // Return the saved hospital data
      return savedHospital;
    });
  }

  async fetchHospitals(query: any) {
    // Modified to include 'users' so the frontend can see the assigned admin
    return this.repo.find({
      relations: ["users"],
      order: { id: "DESC" }
    });
  }

  async fetchDetails(query: any) {
    return this.repo.findOneBy({ id: query.id });
  }

  async updateHospital(body: any, query: any) {
    const hospital = await this.repo.findOneBy({ id: query.id });

    if (!hospital) {
      return null; // not found
    }

    await this.repo.update({ id: query.id }, body);

    // return updated record
    return await this.repo.findOneBy({ id: query.id });
  }


  async deleteHospital(id: number) {
    const hospital = await this.repo.findOneBy({ id });

    if (!hospital) {
      return null; // not found
    }

    await this.repo.delete(id);
    return hospital; // return deleted old data if needed
  }

}
