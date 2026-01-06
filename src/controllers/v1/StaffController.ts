// src/controllers/StaffController.ts

import {
  JsonController, Post, Get, Put, Delete, Body, QueryParams, Res, Req, UseBefore, QueryParam,
} from "routing-controllers";

import { Service } from "typedi";
import { Response, Request } from "express";

import { StaffService } from "../../services/StaffService";
import { ResponseService } from "../../services/ResponseService";
import { CreateStaff, UpdateStaff, StaffId } from "../../validations/StaffValidation"; // Now properly imported
import { AuthMiddleware } from "../../middleware/auth";
import messages from "../../constant/messages";
import { action, component } from "../../constant/api";
import { apiRoute } from "../../utils/apiSemver";
import { UpdateDoctor } from "../../validations/DoctorValidation";

@Service()
@JsonController(apiRoute(component.STAFF))
@UseBefore(AuthMiddleware)
export default class StaffController {
  constructor(
    private staffService: StaffService,
    private responseService: ResponseService
  ) { }

  // ======================= CREATE STAFF (C) =======================
  @Post(action.ADD)
  public async createStaff(
    @Body() body: CreateStaff,
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {
    try {
      // Access Control
      if (req.user?.role !== "admin") {
        return this.responseService.forbidden({ res, message: messages.ACCESS.ADMIN_ONLY });
      }

      // Inject hospitalId from the admin's token
      const hospitalId = req.user?.hospitalId;

      if (!hospitalId) {
        return this.responseService.forbidden({
          res,
          message: "admin must be associated with a Hospital to create Staff.",
        });
      }

      const data = await this.staffService.createStaff({
        ...body,
        hospitalId: hospitalId // Injecting the hospitalId
      });

      return this.responseService.success({
        res,
        message: messages.STAFF.ADD_SUCCESS,
        data,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ======================= GET LIST (R) =======================
  @Get(action.LIST)
  public async listStaff(
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

      const hospitalId = req.user?.hospitalId;

      if (!hospitalId) {
        return this.responseService.forbidden({
          res,
          message: "Admin must belong to a hospital",
        });
      }

      const data = await this.staffService.fetchStaffByHospital(hospitalId);

      return this.responseService.success({
        res,
        message: messages.STAFF.LIST_SUCCESS,
        data,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }


  // ======================= GET DETAILS (R) =======================
  @Get(action.DETAIL)
  public async getDetails(@QueryParams() query: StaffId, @Res() res: Response) {
    try {
      const data = await this.staffService.fetchDetails(query.id);

      if (!data) {
        return this.responseService.noDataFound({ res, message: messages.STAFF.NOT_FOUND });
      }

      return this.responseService.success({ res, message: messages.STAFF.FETCH_SUCCESS, data });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ======================= UPDATE STAFF (U) =======================
  @Put(action.UPDATE)
  public async updateStaff(
    @QueryParams() query: StaffId,
    @Body() body: UpdateDoctor, // Note: You should use UpdateStaff here!
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {
    try {
      if (req.user?.role !== "admin") {
        return this.responseService.forbidden({ res, message: messages.ACCESS.ADMIN_ONLY });
      }

      const updated = await this.staffService.updateStaff(query.id, body);

      return this.responseService.success({ res, message: messages.STAFF.UPDATE_SUCCESS, data: updated });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ======================= DELETE STAFF (D) =======================
  @Delete(action.DELETE)
  public async deleteStaff(
    @QueryParam("id") id: number,
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {
    try {
      if (req.user?.role !== "admin") {
        return this.responseService.forbidden({ res, message: messages.ACCESS.ADMIN_ONLY });
      }

      const deleted = await this.staffService.deleteStaff(id);

      return this.responseService.success({ res, message: messages.STAFF.DELETE_SUCCESS, data: deleted });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }
}