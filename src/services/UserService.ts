/**
 * @author: Hariom Verma
 * @file: src/services/UserService.ts
 * @description: User Service is used as a service for exposing user related methods for primarily
 * UserController. User Service interacts with Database for user related CRUD operations.
 */


import { Service } from "typedi";
import { ApiError } from "../utils/Apierror";
import httpStatus from "http-status";
import { Like, Repository } from "typeorm";
import AppDataSource from "../config/dbconfig";
import { User } from "../entity/Users";
import { Role } from "../entity/Roles";
import bcrypt from "bcrypt";
import messages from "../constant/messages";
import { sign } from 'jsonwebtoken';
import config from "../config/config";
import {
  LoginUser
} from "../validations/UserValidation";
import { generateJwtToken } from '../utils/generateJwtToken'; // adjust path
import { Request, Response } from "express"; // <-- Add this import
// Removed UserData interface as CreateUser is used for validation and data transfer
interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  role?: string;
  policies?: any;
  claims?: any;
  documents?: any;
  payments?: any;
  serviceProviders?: any;
  audits?: any;
}

@Service()
export class UserService {
  private user: Repository<User>;
  private role: Repository<Role>;

  constructor() {
    this.user = AppDataSource.getRepository(User);
    this.role = AppDataSource.getRepository(Role);
  }

  // Method to create a new user
  public async createUser(userData: UserData) {
  try {
    const roleName = userData.role || "customer";
    const role = await this.role.findOne({ where: { name: roleName } });

    if (!role) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Role '${roleName}' not found.`);
    }

    const existingUserByEmail = await this.user.findOne({ where: { email: userData.email } });
    if (existingUserByEmail) {
      throw new ApiError(httpStatus.CONFLICT, `An account with email '${userData.email}' already exists.`);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const userEntity = this.user.create({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      mobile: userData.mobile,
      password: hashedPassword,
      role: role,
    });

    const createdUser = await this.user.save(userEntity);

    // Do not return the password
    const { password, ...userWithoutPassword } = createdUser;

    return userWithoutPassword; // ✅ This is the fix — return clean user data directly

  } catch (error: any) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "User creation failed"
    );
  }
}


  // Method to fetch user data based on query parameters 
  public async fetchData(query: any): Promise<{ count: number; users: User[] }> {
    let queryCondition: any;
    let search = query.search || null;
    if (search && search !== "" && search !== undefined && search !== null)
      // Assuming 'storeName' is a column in your Users entity for searching
      queryCondition = { where: { firstName: Like(`%${search}%`) },
    relations: ['role'], }; // Changed to firstName for Users entity
    else queryCondition = {
      relations: ['role'],
    };
    const count = await this.user.count(queryCondition);
    const users = await this.user.find(queryCondition);

    return { count, users };
  }

  //Fetch user details by userId
  public async fetchDetails(queryParam: { userId: number }): Promise<any | null> {
    const { userId } = queryParam;

    // Attempt to find a user by their ID
    const data = await this.user.findOne({ where: { id: userId },
    relations: ['role'], });

    // If no data is found, return null instead of throwing an error.
    // The controller will then handle the "User not found" response.
    if (!data) {
      console.log(`User with ID ${userId} not found.`); // Log for debugging purposes
      return null;
    }

    console.log(data, "data"); // Log the fetched data if found
    return data; // Return the user data
  }

  // Method to update user data
  public async updateUsers(body: any, queryParam: { userId: number }) {
  const { userId } = queryParam;

  try {
    // 1. Fetch the current user record
    const userToUpdate = await this.user.findOne({ where: { id: userId } });
    if (!userToUpdate) throw new Error("User not found");

    // 2. Handle password hashing
    if (body.password) {
      const saltRounds = 10;
      if (!body.password.startsWith('$2b$')) {
        body.password = await bcrypt.hash(body.password, saltRounds);
      }
    }

    // 3. Handle roleId mapping → role
    if (body.roleId) {
      body.role = { id: body.roleId }; // 👈 tell TypeORM to update relation
      delete body.roleId;              // 👈 prevent conflict
    }

    // 4. Update user
    await this.user.update({ id: userId }, body);

    // 5. Fetch updated record
    const updatedUser = await this.user.findOne({
      where: { id: userId },
      relations: ['role'],
    });

    if (updatedUser) {
      delete updatedUser.password; // hide password
    }

    return updatedUser;
  } catch (error: any) {
    throw error;
  }
}

  // Method to delete a user by userId

  public async deleteUser(userId: number): Promise<void> {
    const userToDelete = await this.user.findOne({ where: { id: userId } });

    if (!userToDelete) {
      throw new Error(`User with id ${userId} not found`);
    }

    try {
      await this.user.remove(userToDelete);
    } catch (error) {
      throw new Error(`Unable to delete user with id ${userId}. Error: ${error.message}`);
    }
  }


  //Login Page
 public async loginUser(user: LoginUser) {
  const userRepo = AppDataSource.getRepository(User);

  // Determine search condition (email or mobile)
  const whereCondition = user.email
    ? { email: user.email }
    : { mobile: user.mobile };

  const existingUser = await userRepo.findOne({
    where: whereCondition,
    relations: ['role'],
  });

  if (!existingUser) {
    throw new Error('Invalid email/mobile or password');
  }

  const isPasswordValid = await bcrypt.compare(user.password, existingUser.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email/mobile or password');
  }

  // Token Payload (include both email and mobile)
  const tokenPayload = {
    userId: existingUser.id,
    email: existingUser.email,
    mobile: existingUser.mobile,
    role: existingUser.role?.name || 'user',
  };

  const token = await generateJwtToken(tokenPayload);

  return {
    user: {
      id: existingUser.id,
      email: existingUser.email,
      mobile: existingUser.mobile,
      name: `${existingUser.firstName} ${existingUser.lastName}`,
      role: existingUser.role?.name,
    },
    token,
  };
}
public async logoutUser(req: Request, res: Response) {
  try {
    // If using cookies to store token
    res.clearCookie('token');

    // If using header token (you don't need to clear from server side,
    // just make client delete/remove it)
    return {
      message: 'Logout successful',
    };
  } catch (error) {
    throw new Error('Logout failed');
  }
}

// In src/services/UserService.ts

// Fetch users by role name (customer/insurer)
public async fetchUsersByRole(roleName: string): Promise<{ count: number; users: User[] }> {
  const role = await this.role.findOne({ where: { name: roleName } });
  if (!role) {
    throw new ApiError(httpStatus.NOT_FOUND, `Role '${roleName}' not found.`);
  }

  const [users, count] = await this.user.findAndCount({
    where: { role: { id: role.id } },
    relations: ['role'],
  });

  return { count, users };
}


}
// Removed unused compare function as bcrypt.compare is used directly.

