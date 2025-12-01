/**
 * @author: Hariom Verma
 * @file: src/controllers/ClaimController.ts
 * @description: Controller for handling claim-related routes (CRUD).
 */

import {
    JsonController,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Res,
    UseBefore,
    QueryParam,
} from "routing-controllers";
import { Service } from "typedi";
import { Response } from "express";

import { ClaimService } from "../../services/ClaimService";
import { ResponseService } from "../../services/ResponseService";
import { CreateClaim, UpdateClaim } from "../../validations/ClaimValidation";

import messages from "../../constant/messages";
import { apiRoute } from "../../utils/apiSemver";
import { component, action } from "../../constant/api";
import { AuthMiddleware } from "../../middleware/auth";

@Service()
@UseBefore(AuthMiddleware)
@JsonController(apiRoute(component.CLAIM))
export class ClaimController {
    constructor(
        private readonly claimService: ClaimService,
        private readonly responseService: ResponseService
    ) { }

    /**
     * @route POST /claims
     * @desc Create a new claim
     */
    @Post(action.ADD)
    public async createClaim(@Body() body: CreateClaim, @Res() res: Response) {
        try {
            const claim = await this.claimService.createClaim(body);
            return this.responseService.success({
                res,
                message: messages.CLAIM.ADD_CLAIM_SUCCESS,
                data: claim,
            });
        } catch (error) {
            return this.responseService.serverError({ res, error });
        }
    }

    /**
     * @route GET /claims
     * @desc Fetch all claims
     */
    @Get(action.LIST)
    public async getClaims(@Res() res: Response) {
        try {
            const claims = await this.claimService.fetchClaims();
            return this.responseService.success({
                res,
                message: messages.CLAIM.CLAIM_LISTING_SUCCESS,
                data: claims,
            });
        } catch (error) {
            return this.responseService.serverError({ res, error });
        }
    }

    /**
     * @route GET /claims/:id
     * @desc Fetch a claim by ID
     */



    @Get(action.DETAIL)
    public async getClaimById(
        @QueryParam("id") id: number,
        @Res() res: Response
    ) {
        try {
            const claim = await this.claimService.getClaimById(id);
            if (!claim) {
                return this.responseService.noDataFound({
                    res,
                    message: messages.CLAIM.NOT_FOUND,
                });
            }
            return this.responseService.success({
                res,
                message: messages.CLAIM.CLAIM_FETCH_SUCCESS,
                data: claim,
            });
        } catch (error) {
            return this.responseService.serverError({ res, error });
        }
    }


    /**
     * @route PUT /claims/:id
     * @desc Update claim details
     */
    @Put(action.UPDATE)
    public async updateClaim(
        @QueryParam("id") id: number,
        @Body() body: UpdateClaim,
        @Res() res: Response
    ) {
        const updated = await this.claimService.updateClaim(id, body);
        return this.responseService.success({ res, message: messages.CLAIM.UPDATE_CLAIM_SUCCESS, data: updated });
    }




    /**
     * @route DELETE /claims/delete?id=1
     * @desc Delete a claim by ID (query param)
     */
    @Delete(action.DELETE)
    public async deleteClaim(
        @QueryParam("id") id: number,
        @Res() res: Response
    ) {
        try {
            await this.claimService.deleteClaim(id);
            return this.responseService.success({
                res,
                message: messages.CLAIM.DELETE_CLAIM_SUCCESS,
                data: null,
            });
        } catch (error) {
            return this.responseService.serverError({ res, error });
        }
    }

}
