// /**
//  * @author: Hariom Verma
//  * @file: src/services/ClaimService.ts
//  * @description: Service for handling claim-related operations (CRUD).
//  */

// import { Service } from "typedi";
// import { Repository } from "typeorm";
// import AppDataSource from "../config/dbconfig";
// import { Claim } from "../entity/Claims";
// import { Policy } from "../entity/Policies";
// import { User } from "../entity/Users";
// import { ApiError } from "../utils/Apierror";
// import httpStatus from "http-status";

// interface ClaimData {
//     claimNumber: string;
//     policyId: number;
//     initiatedById: number;
//     claimType: "cashless" | "reimbursement";
//     claimReason: string;
//     claimDate: string;
//     claimStatus?: "initiated" | "in_review" | "approved" | "rejected" | "settled";
//     claimedAmount?: number;
//     approvedAmount?: number;
// }

// @Service()
// export class ClaimService {
//     private claim: Repository<Claim>;
//     private policy: Repository<Policy>;
//     private user: Repository<User>;

//     constructor() {
//         this.claim = AppDataSource.getRepository(Claim);
//         this.policy = AppDataSource.getRepository(Policy);
//         this.user = AppDataSource.getRepository(User);
//     }

//     // Create a new claim
//     // ClaimService.ts
//     public async createClaim(data: ClaimData): Promise<Claim> {
//         const policy = await this.policy.findOne({ where: { id: data.policyId } });
//         if (!policy) throw new ApiError(httpStatus.NOT_FOUND, "Policy not found");

//         const user = await this.user.findOne({ where: { id: data.initiatedById } });
//         if (!user) throw new ApiError(httpStatus.NOT_FOUND, "Initiating user not found");

//         // Auto-generate claimNumber
//         const count = await this.claim.count();
//         const generatedClaimNumber = `CLM-${1000 + count + 1}`;

//         const newClaim = this.claim.create({
//             ...data,
//             claimNumber: generatedClaimNumber,
//             policy,
//             initiatedBy: user,
//             claimStatus: data.claimStatus || "initiated",
//         });

//         return await this.claim.save(newClaim);
//     }


//     // Fetch claims
//     public async fetchClaims(): Promise<Claim[]> {
//         return await this.claim.find({
//             relations: ["policy", "initiatedBy"],
//             order: { createdAt: "DESC" },
//         });
//     }

//     // Get claim by ID
//     public async getClaimById(id: number): Promise<Claim | null> {
//         return await this.claim.findOne({
//             where: { id },
//             relations: ["policy", "initiatedBy", "documents", "payments"],
//         });
//     }

//     // Update claim
//     public async updateClaim(id: number, body: Partial<ClaimData>): Promise<Claim | null> {
//         const claim = await this.claim.findOne({ where: { id } });
//         if (!claim) throw new ApiError(httpStatus.NOT_FOUND, "Claim not found");

//         Object.assign(claim, body);
//         return await this.claim.save(claim);
//     }

//     // Delete claim (permanent)
//     public async deleteClaim(id: number): Promise<void> {
//         const claim = await this.claim.findOne({ where: { id } });
//         if (!claim) throw new ApiError(httpStatus.NOT_FOUND, "Claim not found");

//         await this.claim.remove(claim);
//     }
// }
