/**
 * @author
 * Role Service – Handles Role CRUD operations
 */

import { Service } from "typedi";
import AppDataSource from "../config/dbconfig";
import { Repository, Like } from "typeorm";
import { Role } from "../entity/Roles";
import messages from "../constant/messages";
import { ApiError } from "../utils/Apierror";
import httpStatus from "http-status";

@Service()
export class RoleService {
  private roleRepo: Repository<Role>;

  constructor() {
    this.roleRepo = AppDataSource.getRepository(Role);
  }

  // ======================= CREATE ============================
  public async createRole(data: { name: string; description?: string }) {
    try {
      const exists = await this.roleRepo.findOne({ where: { name: data.name } });

      if (exists) {
        throw new ApiError(httpStatus.CONFLICT, messages.ROLE.ALREADY_EXISTS);
      }

      const newRole = this.roleRepo.create(data);
      const savedRole = await this.roleRepo.save(newRole);

      return savedRole;

    } catch (error: any) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        error.message || messages.ROLE.ADD_ROLE_FAILED
      );
    }
  }

  // ======================= LISTING ============================
  public async fetchRoles(query: any): Promise<{ count: number; roles: Role[] }> {
    let search = query.search || null;

    const condition = search
      ? { where: { name: Like(`%${search}%`) } }
      : {};

    const count = await this.roleRepo.count(condition);
    const roles = await this.roleRepo.find(condition);

    return { count, roles };
  }

  // ======================= DETAILS ============================
  public async fetchDetails({ id }: { id: number }) {
    const role = await this.roleRepo.findOne({ where: { id } });

    if (!role) return null;
    return role;
  }

  // ======================= UPDATE ============================
  public async updateRole(body: any, { id }: { id: number }) {
    const roleToUpdate = await this.roleRepo.findOne({ where: { id } });

    if (!roleToUpdate) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.ROLE.NOT_FOUND);
    }

    // Check duplicate name
    if (body.name) {
      const exists = await this.roleRepo.findOne({ where: { name: body.name } });
      if (exists && exists.id !== id) {
        throw new ApiError(httpStatus.CONFLICT, messages.ROLE.ALREADY_EXISTS);
      }
    }

    await this.roleRepo.update({ id }, body);
    const updated = await this.roleRepo.findOne({ where: { id } });

    return updated;
  }

  // ======================= DELETE ============================
  public async deleteRole(id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });

    if (!role) {
      throw new ApiError(httpStatus.NOT_FOUND, messages.ROLE.NOT_FOUND);
    }

    try {
      await this.roleRepo.remove(role);
    } catch (error: any) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        messages.ROLE.ROLE_DELETE_FAILED
      );
    }
  }
}
