import {
  JsonController,
  Post,
  Get,
  Put,
  Delete,
  Body,
  QueryParams,
  QueryParam,
  Res
} from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";

import { HospitalService } from "../../services/HospitalService";
import { ResponseService } from "../../services/ResponseService";

import {
  CreateHospital,
  UpdateHospital,
  HospitalId 
} from "../../validations/HospitalValidation";

import messages from "../../constant/messages";
import { action, component } from "../../constant/api";
import { apiRoute } from "../../utils/apiSemver";

@Service()
@JsonController(apiRoute(component.HOSPITAL))
export default class HospitalController {
  // Rely on TypeDI for dependency injection. The manual new Service() calls are removed.
  constructor(
    private hospitalService: HospitalService,
    private responseService: ResponseService
  ) {} 

  // Create Hospital
  @Post(action.ADD)
  public async createHospital(@Body() body: CreateHospital, @Res() res: Response) {
    try {
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

  // List (Uses @QueryParams to inject all query parameters into the 'query' object)
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

  // Details (Uses @QueryParams with the HospitalId class/interface)
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

  // Update (Combines @QueryParams for ID and @Body for the payload)
  @Put(action.UPDATE)
  public async updateHospital(
    @QueryParams() query: HospitalId,
    @Body() body: UpdateHospital,
    @Res() res: Response
  ) {
    try {
      const updated = await this.hospitalService.updateHospital(body, query);

      return this.responseService.success({
        res,
        message: messages.HOSPITAL.UPDATE_SUCCESS,
        data: updated
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // Delete (Uses @QueryParam to target a single named parameter 'id')
  @Delete(action.DELETE)
  public async deleteHospital(
    @QueryParam("id") id: number,
    @Res() res: Response
  ) {
    try {
      await this.hospitalService.deleteHospital(id);

      return this.responseService.success({
        res,
        message: messages.HOSPITAL.DELETE_SUCCESS
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }
}