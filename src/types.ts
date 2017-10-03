import { Response } from "express";
export interface ClientError {
  type: string;
}

export interface APIResponse<R> extends Response {
  rawResData: R;
  serverError?: Error;
  clientError?: ClientError;
}
export interface APIResult<R> {
  api: string;
  method: string;
  version: string;
  result: {
    code: string;
    message?: string;
    data?: R;
  };
}
