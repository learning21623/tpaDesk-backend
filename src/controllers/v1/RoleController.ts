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
  Req
} from "routing-controllers";
import { Service } from "typedi";
import { RoleService } from "../../services/RoleService";
import { ResponseService } from "../../services/ResponseService";
import { CreateRole, UpdateRole, RoleId } from "../../validations/RoleValidation";
import messages from "../../constant/messages";
import { action, component } from "../../constant/api";
import { apiRoute } from "../../utils/apiSemver";
import { Request, Response } from "express";

@Service()
@JsonController(apiRoute(component.ROLE))
export default class RoleController {
  constructor(
    private roleService: RoleService,
    private responseService: ResponseService
  ) {
    this.roleService = new RoleService();
    this.responseService = new ResponseService();
  }

  // ============ ADD ROLE ============
  @Post(action.ADD)
  public async createRole(
    @Body() body: CreateRole,
    @Res() res: Response
  ) {
    try {
      const data = await this.roleService.createRole(body);

      return this.responseService.success({
        res,
        message: messages.ROLE.ADD_ROLE_SUCCESS,
        data,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ============ LIST ============
  @Get(action.LIST)
  public async listRoles(
    @QueryParams() query: any,
    @Res() res: Response
  ) {
    try {
      const data = await this.roleService.fetchRoles(query);

      return this.responseService.success({
        res,
        message: messages.ROLE.ROLE_LISTING_SUCCESS,
        data,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ============ DETAILS ============
  @Get(action.DETAIL)
  public async getDetails(
    @QueryParams() query: RoleId,
    @Res() res: Response
  ) {
    try {
      const data = await this.roleService.fetchDetails(query);

      if (!data) {
        return this.responseService.noDataFound({
          res,
          message: messages.ROLE.NOT_FOUND,
        });
      }

      return this.responseService.success({
        res,
        message: messages.ROLE.ROLE_FETCH,
        data,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ============ UPDATE ============
  @Put(action.UPDATE)
  public async updateRole(
    @QueryParams() query: RoleId,
    @Body() body: UpdateRole,
    @Res() res: Response
  ) {
    try {
      const updated = await this.roleService.updateRole(body, query);

      return this.responseService.success({
        res,
        message: messages.ROLE.ROLE_UPDATE_SUCCESS,
        data: updated,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // ============ DELETE ============
  @Delete(action.DELETE)
  public async deleteRole(
    @QueryParam("id") id: number,
    @Res() res: Response
  ) {
    try {
      await this.roleService.deleteRole(id);

      return this.responseService.success({
        res,
        message: messages.ROLE.ROLE_DELETED,
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }
}
