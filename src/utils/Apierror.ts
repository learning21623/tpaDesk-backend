import { HttpError } from "routing-controllers";

export class ApiError extends Error {
  httpCode: number;
  errorCode?: string;
  FTA?: string;

  constructor(status: number, message?: string, FTA?: string) {
    super(message);

    this.httpCode = status;
    this.errorCode = FTA;
    this.FTA = FTA;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}
