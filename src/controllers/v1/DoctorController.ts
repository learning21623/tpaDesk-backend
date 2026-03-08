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
  ) {}

  // ADD DOCTOR
  @Post(action.ADD)
  public async createDoctor(
    @Body() body: CreateDoctor,
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {

    try {

      if (req.user?.role !== "admin") {
        return this.responseService.forbidden({
          res,
          message: messages.ACCESS.ADMIN_ONLY
        });
      }

      const hospitalId = req.user?.hospitalId;

      const data = await this.doctorService.createDoctor({
        ...body,
        hospitalId
      });

      return this.responseService.success({
        res,
        message: messages.DOCTOR.ADD_SUCCESS,
        data
      });

    } catch (error) {
      return this.responseService.serverError({ res, error });
    }

  }

  // LIST
  @Get(action.LIST)
  public async listDoctors(
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {

    try {

      const hospitalId = req.user?.hospitalId;

      const data = await this.doctorService.fetchDoctors(hospitalId);

      return this.responseService.success({
        res,
        message: messages.DOCTOR.LIST_SUCCESS,
        data
      });

    } catch (error) {
      return this.responseService.serverError({ res, error });
    }

  }

  // DETAILS
  @Get(action.DETAIL)
  public async getDetails(
    @QueryParams() query: DoctorId,
    @Res() res: Response
  ) {

    try {

      const data = await this.doctorService.fetchDetails(query.id);

      return this.responseService.success({
        res,
        message: messages.DOCTOR.FETCH_SUCCESS,
        data
      });

    } catch (error) {
      return this.responseService.serverError({ res, error });
    }

  }

}