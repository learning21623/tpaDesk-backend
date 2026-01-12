import {
  JsonController,
  Post,
  Get,
  Put,
  Delete,
  Body,
  QueryParams,
  QueryParam,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { Request, Response } from "express";

import { AuthMiddleware } from "../../middleware/auth";
import { PatientService } from "../../services/PatientService";
import { ResponseService } from "../../services/ResponseService";

import {
  CreatePatient,
  UpdatePatient,
  UpdatePatientAmount,
  UpdatePatientMedical,
  PatientId,
} from "../../validations/PatientValidation";

import messages from "../../constant/messages";
import { apiRoute } from "../../utils/apiSemver";
import { component, action } from "../../constant/api";

@Service()
@JsonController(apiRoute(component.PATIENT))
@UseBefore(AuthMiddleware)
export default class PatientController {
  constructor(
    private patientService: PatientService,
    private responseService: ResponseService
  ) { }

  @Post(action.ADD)
  async create(@Body() body: CreatePatient, @Req() req: any, @Res() res: Response) {
    if (req.user.role !== "staff") {
      return this.responseService.forbidden({ res, message: messages.ACCESS.STAFF_ONLY });
    }
    const data = await this.patientService.createPatient(body, req.user);
    return this.responseService.success({ res, message: messages.PATIENT.ADD_SUCCESS, data });
  }

  @Get(action.LIST)
  async list(@Req() req: any, @Res() res: Response) {
    if (!["staff", "doctor"].includes(req.user.role)) {
      return this.responseService.forbidden({ res, message: messages.ACCESS.STAFF_DOCTOR_ONLY });
    }
    // This now filters automatically inside the service
    const data = await this.patientService.listPatients(req.user);
    return this.responseService.success({ res, message: messages.PATIENT.LIST_SUCCESS, data });
  }

  @Get(action.DETAIL)
  async detail(@QueryParams() query: PatientId, @Req() req: any, @Res() res: Response) {
    const data = await this.patientService.getPatientDetail(query.id, req.user);
    return this.responseService.success({ res, message: messages.PATIENT.FETCH_SUCCESS, data });
  }

  @Get(action.GET_DOCTORS)
  async getDoctors(@Req() req: any, @Res() res: Response) {
    const data = await this.patientService.getDoctorsByHospital(req.user.hospitalId);
    return this.responseService.success({ res, message: "Doctors fetched", data });
  }

  @Put(action.UPDATE_BASIC)
  async updateBasic(@QueryParams() query: PatientId, @Body() body: UpdatePatient, @Req() req: any, @Res() res: Response) {
    if (req.user.role !== "staff") {
      return this.responseService.forbidden({ res, message: messages.ACCESS.STAFF_ONLY });
    }
    const data = await this.patientService.updateBasic(query.id, body, req.user);
    return this.responseService.success({ res, message: messages.PATIENT.UPDATE_SUCCESS, data });
  }

  @Put(action.UPDATE_AMOUNT)
  async updateAmount(
    @QueryParams() query: PatientId, // This looks for ?id=18
    @Body({ validate: true }) body: UpdatePatientAmount,
    @Req() req: any,
    @Res() res: Response
  ) {
    if (req.user.role !== "staff") {
      return this.responseService.forbidden({ res, message: "Staff only" });
    }
    const data = await this.patientService.updateAmount(query.id, body, req.user);
    return this.responseService.success({ res, message: "Amount updated", data });
  }

  @Put(action.UPDATE_MEDICAL)
  async updateMedical(
    @QueryParams() query: PatientId, // This looks for ?id=18
    @Body({ validate: true }) body: UpdatePatientMedical,
    @Req() req: any,
    @Res() res: Response
  ) {
    if (req.user.role !== "staff" && req.user.role !== "doctor") {
      return this.responseService.forbidden({ res, message: "Unauthorized access" });
    }
    const data = await this.patientService.updateMedical(query.id, body, req.user);
    return this.responseService.success({ res, message: "Medical updated", data });
  }

  @Delete(action.DELETE)
  async delete(@QueryParam("id") id: number, @Req() req: any, @Res() res: Response) {
    if (req.user.role !== "doctor") {
      return this.responseService.forbidden({ res, message: messages.ACCESS.DOCTOR_ONLY });
    }
    await this.patientService.deletePatient(id, req.user);
    return this.responseService.success({ res, message: messages.PATIENT.DELETE_SUCCESS });
  }
}
