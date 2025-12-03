// /**
//  * @author: Hariom Verma
//  * @file: src/services/PolicyService.ts
//  * @description: Service for handling policy-related operations (CRUD).
//  */

// import { Service } from "typedi";
// import { Like, Repository } from "typeorm";
// import AppDataSource from "../config/dbconfig";
// import { Policy } from "../entity/Policies";
// import { User } from "../entity/Users";
// import { ApiError } from "../utils/Apierror";
// import httpStatus from "http-status";

// interface PolicyData {
//     policyNumber: string;
//     policyType: "life" | "health" | "motor" | "property" | "crop" | "travel";
//     userId: number;
//     insurerId: number;
//     sumAssured: number;
//     premium: number;
//     startDate: string;
//     endDate: string;
//     status?: "active" | "expired" | "cancelled";
// }

// interface PolicyQuery {
//     userId?: number;
//     policyType?: string;
//     status?: string;
//     page?: number;
//     limit?: number;
//     search?: string; // for policyNumber
// }


// @Service()
// export class PolicyService {
//     private policy: Repository<Policy>;
//     private user: Repository<User>;

//     constructor() {
//         this.policy = AppDataSource.getRepository(Policy);
//         this.user = AppDataSource.getRepository(User);
//     }

//     // Create a new policy
//     public async createPolicy(data: PolicyData): Promise<Policy> {
//         const user = await this.user.findOne({ where: { id: data.userId } });
//         if (!user) throw new ApiError(httpStatus.NOT_FOUND, "Policyholder not found");

//         const insurer = await this.user.findOne({ where: { id: data.insurerId } });
//         if (!insurer) throw new ApiError(httpStatus.NOT_FOUND, "Insurer not found");

//         const newPolicy = this.policy.create({
//             ...data,
//             user,
//             insurer,
//             status: data.status || "active",
//         });

//         return await this.policy.save(newPolicy);
//     }
//     // Fetch policies with optional filters and search
//     public async fetchPolicies(query: any): Promise<{ count: number; policies: Policy[] }> {
//         let queryCondition: any;
//         const search = query.search || null;

//         if (search && search !== "" && search !== undefined && search !== null) {
//             // Searching by policyNumber
//             queryCondition = {
//                 where: { policyNumber: Like(`%${search}%`) },
//                 relations: ["user", "insurer"],
//             };
//         } else {
//             queryCondition = {
//                 relations: ["user", "insurer"],
//             };
//         }

//         // Optional filter by status (active/expired/cancelled)
//         if (query.status) {
//             queryCondition.where = {
//                 ...(queryCondition.where || {}),
//                 status: query.status,
//             };
//         }

//         // Optional filter by policyType (life, health, motor etc.)
//         if (query.policyType) {
//             queryCondition.where = {
//                 ...(queryCondition.where || {}),
//                 policyType: query.policyType,
//             };
//         }

//         // Count + Fetch
//         const count = await this.policy.count(queryCondition);
//         const policies = await this.policy.find(queryCondition);

//         return { count, policies };
//     }

//     // Get policy by ID
//     public async getPolicyById(id: number): Promise<Policy | null> {
//         return await this.policy.findOne({
//             where: { id },
//             relations: ["user", "insurer"],
//         });
//     }

//     // List policies by userId
//     public async getPoliciesByUser(userId: number): Promise<Policy[]> {
//         return await this.policy.find({
//             where: { user: { id: userId } },
//             relations: ["user", "insurer"],
//         });
//     }

//     // Update policy
//     public async updatePolicy(id: number, body: Partial<PolicyData>): Promise<Policy | null> {
//         const policy = await this.policy.findOne({ where: { id } });
//         if (!policy) throw new ApiError(httpStatus.NOT_FOUND, "Policy not found");

//         Object.assign(policy, body);

//         return await this.policy.save(policy);
//     }

//     // permanent delete
//     public async deletePolicy(id: number): Promise<void> {
//         const policy = await this.policy.findOne({ where: { id } });
//         if (!policy) throw new ApiError(httpStatus.NOT_FOUND, "Policy not found");

//         await this.policy.remove(policy); // this will PERMANENTLY delete
//     }

//     // Soft delete policy (deactivate instead of remove)
//     //   public async deactivatePolicy(id: number): Promise<Policy | null> {
//     //     const policy = await this.policy.findOne({ where: { id } });
//     //     if (!policy) throw new ApiError(httpStatus.NOT_FOUND, "Policy not found");

//     //     policy.status = "cancelled";
//     //     return await this.policy.save(policy);

//     //   }
// }
