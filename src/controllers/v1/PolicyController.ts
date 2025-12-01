// src/controllers/PolicyController.ts

import {
    JsonController,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    QueryParams,
    Req,
    Res,
    UseBefore,
} from "routing-controllers";
import { Service } from "typedi";
import { Request, Response } from "express";

import { PolicyService } from "../../services/PolicyService";
import { ResponseService } from "../../services/ResponseService";
import {
    CreatePolicy,
    PolicyId,
    PolicyListing,
} from "../../validations/PolicyValidation";

import messages from "../../constant/messages";
import { apiRoute } from "../../utils/apiSemver";
import { component, action } from "../../constant/api";
import { AuthMiddleware } from "../../middleware/auth";

@Service()
@UseBefore(AuthMiddleware)
@JsonController(apiRoute(component.POLICY))
export default class PolicyController {
    constructor(
        private readonly policyService: PolicyService,
        private readonly responseService: ResponseService
    ) { }

    /**
     * @route POST /policies
     * @desc Create a new policy
     */
    @Post(action.ADD)
    public async createPolicy(
        @Req() req: Request,
        @Body() policyData: CreatePolicy,
        @Res() res: Response
    ) {
        try {
            const policy = await this.policyService.createPolicy({
                ...policyData,
                policyType: policyData.policyType as "life" | "health" | "motor" | "property" | "crop" | "travel",
            });
            return this.responseService.success({
                res,
                message: messages.POLICY.ADD_POLICY_SUCCESS,
                data: policy,
            });
        } catch (error) {
            return this.responseService.serverError({ res, error });
        }
    }

    /**
     * @route GET /policies/:id
     * @desc Get a single policy by ID
     */
    @Get(action.DETAIL)
    public async getPolicyById(
        @Req() req: Request,
        @QueryParams() query: PolicyId,
        @Res() res: Response
    ) {
        try {
            const policy = await this.policyService.getPolicyById(query.policyId);
            if (!policy) {
                return this.responseService.noDataFound({
                    res,
                    message: messages.POLICY.NOT_FOUND,
                });
            }
            return this.responseService.success({
                res,
                message: messages.SUCCESS,
                data: policy,
            });
        } catch (error) {
            return this.responseService.serverError({ res, error });
        }
    }

    /**
     * @route GET /policies
     * @desc Get all policies with pagination, sorting, filtering
     */
    @Get(action.LIST)
    public async getPolicies(
        @QueryParams() query: PolicyListing,
        @Res() res: Response
    ) {
        try {
            const policies = await this.policyService.fetchPolicies(query);
            return this.responseService.success({
                res,
                message: messages.SUCCESS,
                data: policies,
            });
        } catch (error) {
            return this.responseService.serverError({ res, error });
        }
    }

    /**
     * @route PUT /policies/:id
     * @desc Update policy details
     */
    @Put(action.UPDATE)
    public async updatePolicy(
        @QueryParams() query: PolicyId,
        @Body() body: any,
        @Res() res: Response
    ) {
        try {
            const updatedPolicy = await this.policyService.updatePolicy(query.policyId, body);
            return this.responseService.success({
                res,
                message: messages.POLICY.UPDATE_POLICY_SUCCESS,
                data: updatedPolicy,
            });
        } catch (error) {
            return this.responseService.serverError({ res, error });
        }
    }


    // /**
    //  * @route DELETE /policies/:id
    //  * @desc Soft delete / deactivate a policy
    //  */
    @Delete(action.DELETE)
public async deletePolicy(
  @QueryParams() query: PolicyId,
  @Res() res: Response
) {
  try {
    await this.policyService.deletePolicy(query.policyId);
    return this.responseService.success({
      res,
      message: messages.POLICY.DELETE_POLICY_SUCCESS,
      data: null,
    });
  } catch (error) {
    if (error.statusCode === 404) {
      // clean "not found" response
      return this.responseService.error({
        res,
        message: "Policy not found",
        statusCode: 404,
      });
    }
    return this.responseService.serverError({ res, error });
  }
}


}
