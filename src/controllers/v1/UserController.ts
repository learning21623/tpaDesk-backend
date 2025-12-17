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
  Res
} from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "../../services/UserService";
import { ResponseService } from "../../services/ResponseService";
import {
  CreateUser,
  UpdateUser,
  UserId,
  UserLogin
} from "../../validations/UserValidation";
import messages from "../../constant/messages";
import { action, component } from "../../constant/api";
import { apiRoute } from "../../utils/apiSemver";
import { Response } from "express";
import { UseBefore } from "routing-controllers";
import { AuthMiddleware } from "../../middleware/auth";

@Service()
@JsonController(apiRoute(component.USER))
export default class UserController {
  constructor(
    private userService: UserService,
    private responseService: ResponseService
  ) {
    this.userService = new UserService();
    this.responseService = new ResponseService();
  }

  // Create User
  @Post(action.ADD)
  public async createUser(@Body() body: CreateUser, @Res() res: Response) {
    try {
      const data = await this.userService.createUser(body);

      return this.responseService.success({
        res,
        message: messages.USER.ADD_USER_SUCCESS,
        data
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // List Users
  @Get(action.LIST)
  public async listUsers(@QueryParams() query: any, @Res() res: Response) {
    try {
      const data = await this.userService.fetchUsers(query);

      return this.responseService.success({
        res,
        message: messages.USER.USER_LISTING_SUCCESS,
        data
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  //Role Base Hospital User List
  @Get(action.HOSPITAL_USER_LIST)
  @UseBefore(AuthMiddleware)
  public async getHospitalOverview(@Req() req: Request & { user?: any }, @Res() res: Response) {
    try {
      // Basic security check
      if (req.user.role !== "superAdmin") {
        return res.status(403).json({ message: "Access Denied: SuperAdmin only" });
      }

      const data = await this.userService.fetchHospitalsWithAdmins();

      return res.status(200).json({
        success: true,
        message: "Hospital and Admin details fetched successfully",
        data
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // User Details
  @Get(action.DETAIL)
  public async getDetails(@QueryParams() query: UserId, @Res() res: Response) {
    try {
      const data = await this.userService.fetchDetails(query);

      if (!data) {
        return this.responseService.noDataFound({
          res,
          message: messages.USER.NOT_FOUND
        });
      }

      return this.responseService.success({
        res,
        message: messages.USER.USER_FETCH,
        data
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // Update User
  @Put(action.UPDATE)
  public async updateUser(
    @QueryParams() query: UserId,
    @Body() body: UpdateUser,
    @Res() res: Response
  ) {
    try {
      const updated = await this.userService.updateUser(body, query);

      return this.responseService.success({
        res,
        message: messages.USER.USER_UPDATE_SUCCESS,
        data: updated
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // Delete User
  @Delete(action.DELETE)
  public async deleteUser(
    @QueryParam("id") id: number,
    @Res() res: Response
  ) {
    try {
      await this.userService.deleteUser(id);

      return this.responseService.success({
        res,
        message: messages.USER.DELETE_USER_SUCCESS
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }

  // Login User
  @Post(action.LOGIN)
  public async login(@Body() body: UserLogin, @Res() res: Response) {
    try {
      const data = await this.userService.login(body);

      return this.responseService.success({
        res,
        message: messages.USER.LOGIN_USER_SUCCESS,
        data: {
          user: data.user,
          token: data.token,
        }
      });
    } catch (error) {
      return this.responseService.serverError({ res, error });
    }
  }
}
