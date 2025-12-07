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
  UseBefore
} from "routing-controllers";

import { Service } from "typedi";
import { Response, Request } from "express";

import { HospitalService } from "../../services/HospitalService";
import { ResponseService } from "../../services/ResponseService";

import {
  CreateHospital,
  UpdateHospital,
  HospitalId
} from "../../validations/HospitalValidation";

import { AuthMiddleware } from "../../middleware/AuthMiddleware";

import messages from "../../constant/messages";
import { action, component } from "../../constant/api";
import { apiRoute } from "../../utils/apiSemver";

@Service()
@JsonController(apiRoute(component.HOSPITAL))
@UseBefore(AuthMiddleware)   // 🔥 apply middleware to all hospital routes
export default class HospitalController {
  constructor(
    private hospitalService: HospitalService,
    private responseService: ResponseService
  ) { }

  // Create Hospital
  @Post(action.ADD)
  public async createHospital(
    @Body() body: CreateHospital,
    @Req() req: Request & { user?: any },
    @Res() res: Response
  ) {
    try {
      // Role check
      if (req.user?.role !== "superAdmin") {
        return this.responseService.forbidden({
          res,
          message: "You are not authorized to create hospital"
        });
      }

      const data = await this.hospitalService.createHospitals(body);

      return this.responseService.success({
        res,
        message: messages.HOSPITAL.ADD_SUCCESS,
        data
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // Get List
  @Get(action.LIST)
  public async listHospitals(@QueryParams() query: any, @Res() res: Response) {
    try {
      const data = await this.hospitalService.fetchHospitals(query);

      return this.responseService.success({
        res,
        message: messages.HOSPITAL.LIST_SUCCESS,
        data
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // Details by ID
  @Get(action.DETAIL)
  public async getDetails(@QueryParams() query: HospitalId, @Res() res: Response) {
    try {
      const data = await this.hospitalService.fetchDetails(query);

      if (!data) {
        return this.responseService.noDataFound({
          res,
          message: messages.HOSPITAL.NOT_FOUND
        });
      }

      return this.responseService.success({
        res,
        message: messages.HOSPITAL.FETCH_SUCCESS,
        data
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // Update
  @Put(action.UPDATE)
  public async updateHospital(
    @QueryParams() query: HospitalId,
    @Body() body: UpdateHospital,
    @Res() res: Response
  ) {
    try {
      const updated = await this.hospitalService.updateHospital(body, query);

      if (!updated) {
        return this.responseService.noDataFound({
          res,
          message: "Hospital does not exist"
        });
      }

      return this.responseService.success({
        res,
        message: messages.HOSPITAL.UPDATE_SUCCESS,
        data: updated
      });

    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // Delete
  @Delete(action.DELETE)
public async deleteHospital(@QueryParam("id") id: number, @Res() res: Response) {
  try {
    const deleted = await this.hospitalService.deleteHospital(id);

    if (!deleted) {
      return this.responseService.noDataFound({
        res,
        message: "Hospital does not exist"
      });
    }

    return this.responseService.success({
      res,
      message: messages.HOSPITAL.DELETE_SUCCESS,
      data: deleted
    });

  } catch (error) {
    return this.responseService.serverError({ res, error });
  }
}

}
