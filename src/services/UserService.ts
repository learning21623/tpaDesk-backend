/**
 * @author
 * User Service – Handles User CRUD operations
 */

import { Service } from "typedi";
import AppDataSource from "../config/dbconfig";
import { Repository, Like } from "typeorm";
import { User } from "../entity/Users";
import messages from "../constant/messages";
import { ApiError } from "../utils/Apierror";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import { generateJwtToken } from "../utils/generateJwtToken";
import { user } from "../constant/errors/user";
import { Hospital } from "../entity/Hospital";

@Service()
export class UserService {

  private userRepo: Repository<User>;
  private hospitalRepo: Repository<Hospital>;

  constructor() {
    this.userRepo = AppDataSource.getRepository(User);
    this.hospitalRepo = AppDataSource.getRepository(Hospital);
  }

  // ======================= CREATE USER ============================
  public async createUser(data: any) {
    try {
      const exists = await this.userRepo.findOne({
        where: { email: data.email },
      });

      if (exists) {
        throw new ApiError(httpStatus.CONFLICT, messages.USER.ALREADY_EXISTS);
      }

      data.password = await bcrypt.hash(data.password, 10);

      const newUser = this.userRepo.create(data);
      const savedUser = await this.userRepo.save(newUser);

      return savedUser;

    } catch (error: any) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || messages.USER.ADD_USER_FAILED
      );
    }
  }

  // ======================= LOGIN USER ============================
  public async login(body: any) {
    const { email, password } = body;

    const user = await this.userRepo.findOne({
      where: { email },
      relations: ["role", "hospital"], // <-- Load hospital relation
    });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.USER.NOT_FOUND);
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new ApiError(httpStatus.BAD_REQUEST, messages.USER.INVALID_CREDENTIALS);
    }

    // Create JWT Payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role?.name || null,
      hospitalId: user.hospitalId || null, // <-- Add Hospital ID
      hospitalName: user.hospital?.name || null, // <-- Add Hospital Name
    };

    // Generate JWT Token
    const token = await generateJwtToken(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        hospitalId: user.hospitalId || null, // <-- Include in user response object
        // role: user.role?.name,
      },
    };
  }

  // ======================= LIST USERS ============================
  // ======================= LIST USERS ============================
public async fetchUsers(query: any) {
    // 1. Extract and Parse Pagination Params
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = query.search || "";

    // 2. Build Query Condition
    const condition: any = {
        relations: ["role"],
        order: { createdAt: "DESC" }, // Most recent first
        take: limit,
        skip: skip,
    };

    // 3. Add Search Logic if search string exists
    if (search) {
        condition.where = [
            { firstName: Like(`%${search}%`) },
            { lastName: Like(`%${search}%`) },
            { email: Like(`%${search}%`) },
        ];
    }

    // 4. Execute Query
    const [users, count] = await this.userRepo.findAndCount(condition);

    // 5. Security: Remove passwords from the response
    const safeUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });

    return { 
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        users: safeUsers 
    };
}

  //Role Based User Hosptial Listing
  // UserService.ts

public async fetchHospitalsWithAdmins() {
  // Use the Repository for the Hospital entity
  

  const data = await this.hospitalRepo
    .createQueryBuilder("hospital")
    .leftJoinAndSelect(
      "hospital.users", // 👈 This now works because users is defined in Hospital entity
      "user", 
      "user.roleId = :roleId", 
      { roleId: 2 } // roleId 2 is Admin
    )
    .select([
      "hospital.id",
      "hospital.name",
      "hospital.email",
      "user.id",
      "user.firstName",
      "user.lastName",
      "user.email"
    ])
    .getMany();

  return data;
}

  // ======================= DETAILS ============================
  public async fetchDetails({ id }: { id: number }) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ["role"],
    });

    return user || null;
  }

  // ======================= UPDATE USER ============================
  public async updateUser(body: any, { id }: { id: number }) {
    const userToUpdate = await this.userRepo.findOne({
      where: { id },
      relations: ["role"],
    });

    if (!userToUpdate) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.USER.NOT_FOUND);
    }

    // Remove relation to prevent overwrite issues
    delete userToUpdate.role;

    // Duplicate email
    if (body.email) {
      const exists = await this.userRepo.findOne({
        where: { email: body.email },
      });

      if (exists && exists.id !== id) {
        throw new ApiError(httpStatus.CONFLICT, messages.USER.ALREADY_EXISTS);
      }
    }

    // Password change
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    // Merge new data
    Object.assign(userToUpdate, body);

    // Save updated user
    await this.userRepo.save(userToUpdate);

    return await this.userRepo.findOne({
      where: { id },
      relations: ["role"],
    });
  }



  // ======================= DELETE USER ============================
  public async deleteUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.USER.NOT_FOUND);
    }

    try {
      await this.userRepo.remove(user);
    } catch (error: any) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        messages.USER.DELETE_USER_FAILED
      );
    }
  }
}
