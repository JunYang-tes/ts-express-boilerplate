import { Request } from "express"
import { APIResponse, APIResult } from "../types"
import { ErrorType, ReturnCode } from "../const/error"

export function APIHander(version: string, debug = true) {
  return <T>(req: Request, res: APIResponse<any>) => {
    const resData: APIResult<any> = {
      api: req.originalUrl,
      method: req.method,
      version,
      result: {
        code: ReturnCode.SUCCESS,
        message: ""
      }
    }
    if (res.hasOwnProperty("serverError")) {
      resData.result.code = ReturnCode.INTERNAL_ERROR
      if (debug) {
        resData.result.message = res.serverError.message
        resData.result.data = res.serverError.stack
      }
      res.status(500).send(resData)
    } else if (res.hasOwnProperty("clientError")) {
      resData.result.code = ReturnCode.CLIENT_ERROR
      resData.result.data = res.clientError
      res.status(417).send(resData)
    } else if (res.hasOwnProperty("rawResData")) {
      resData.result.data = res.rawResData
      res.status(200).send(resData)
    } else {
      resData.result.code = ReturnCode.CLIENT_ERROR
      resData.result.message = "No such API"
      res.status(417).send(resData)
    }
  }
}
