import { Service } from "typedi";
import AppDataSource from "../config/dbconfig";
import { Hospital } from "../entity/Hospital";

@Service()
export class HospitalService {
  private repo = AppDataSource.getRepository(Hospital);

  async createHospitals(body: any) {
    return this.repo.save(body);
  }

  async fetchHospitals(query: any) {
    return this.repo.find();
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
