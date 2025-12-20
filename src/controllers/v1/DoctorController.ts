// src/controllers/DoctorController.ts

import {
  JsonController,
  Post,
  Get,
  Put,
  Delete,
  Body,
  QueryParams,
  QueryParam,
  Res,
  Req,
  UseBefore,
} from "routing-controllers";

import { Service } from "typedi";
import { Response, Request } from "express";

import { DoctorService } from "../../services/DoctorService";
import { ResponseService } from "../../services/ResponseService"; // For consistent response formatting

// Assuming these exist for validation/type checking
import { CreateDoctor, UpdateDoctor, DoctorId } from "../../validations/DoctorValidation";
import { AuthMiddleware } from "../../middleware/AuthMiddleware"; // To decode JWT and attach req.user

import messages from "../../constant/messages";
import { action, component } from "../../constant/api";
import { apiRoute } from "../../utils/apiSemver";

@Service()
@JsonController(apiRoute(component.DOCTOR))
@UseBefore(AuthMiddleware) // Ensure the token is processed before any action
export default class DoctorController {
  constructor(
    private doctorService: DoctorService,
    private responseService: ResponseService
  ) { }

  // ======================= CREATE DOCTOR (C) =======================
  @Post(action.ADD)
  public async createDoctor(
    @Body() body: CreateDoctor,
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {
    try {
      // 1. Access Control: Only Admins can create Doctors
      if (req.user?.role !== "admin") {
        return this.responseService.forbidden({
          res,
          message: messages.ACCESS.ADMIN_ONLY,
        });
      }

      // 2. Inject hospitalId from the admin's token (hospitalId: 1 in your case)
      const hospitalId = req.user?.hospitalId;

      if (!hospitalId) {
        return this.responseService.forbidden({
          res,
          message: "admin must be associated with a Hospital to create a Doctor.",
        });
      }

      // 3. Call the Service with the complete data object
      const data = await this.doctorService.createDoctor({
        ...body,
        hospitalId: hospitalId // Injecting the hospitalId
      });

      return this.responseService.success({
        res,
        message: messages.DOCTOR.ADD_SUCCESS,
        data,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ======================= GET LIST (R) =======================
  @Get(action.LIST)
  public async listDoctors(
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {
    try {
      // 1. Identify the logged-in user's role and hospital context
      const role = req.user?.role;
      const adminHospitalId = req.user?.hospitalId;

      let data;

      // 2. Filter logic based on role
      if (role === "admin") {
        // If Admin, only fetch doctors for THEIR hospitalId (e.g., ID: 1)
        data = await this.doctorService.fetchDoctors(adminHospitalId);
      // } else if (role === "superAdmin") {
      //   // SuperAdmins can see everything
      //   data = await this.doctorService.fetchDoctors();
      } else {
        return this.responseService.forbidden({
          res,
          message: "You do not have permission to view the doctor list.",
        });
      }

      return this.responseService.success({
        res,
        message: messages.DOCTOR.LIST_SUCCESS,
        data,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ======================= GET DETAILS (R) =======================
  @Get(action.DETAIL)
  public async getDetails(@QueryParams() query: DoctorId, @Res() res: Response) {
    try {
      const data = await this.doctorService.fetchDetails(query.id);

      if (!data) {
        return this.responseService.noDataFound({
          res,
          message: messages.DOCTOR.NOT_FOUND,
        });
      }

      return this.responseService.success({
        res,
        message: messages.DOCTOR.FETCH_SUCCESS,
        data,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ======================= UPDATE DOCTOR (U) =======================
  @Put(action.UPDATE)
  public async updateDoctor(
    @QueryParams() query: DoctorId,
    @Body() body: UpdateDoctor,
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {
    try {
      if (req.user?.role !== "admin") {
        return this.responseService.forbidden({
          res,
          message: messages.ACCESS.ADMIN_ONLY,
        });
      }

      // Call the service with the doctor ID and the body data
      const updated = await this.doctorService.updateDoctor(
        query.id,
        body
      );

      return this.responseService.success({
        res,
        message: messages.DOCTOR.UPDATE_SUCCESS,
        data: updated,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ======================= DELETE DOCTOR (D) =======================
  @Delete(action.DELETE)
  public async deleteDoctor(
    @QueryParam("id") id: number,
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {
    try {
      if (req.user?.role !== "admin") {
        return this.responseService.forbidden({
          res,
          message: messages.ACCESS.ADMIN_ONLY,
        });
      }

      const deleted = await this.doctorService.deleteDoctor(id);

      return this.responseService.success({
        res,
        message: messages.DOCTOR.DELETE_SUCCESS,
        data: deleted,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }
}