import { NextFunction, Request, Response } from "express"
import { APIResponse } from "../types"
const { debug } = require("b-logger")("api")
export type Controller<R> = (req: Request, res: Response) => R

export function api<R>(controller: Controller<R>) {
  return async (req: Request, res: APIResponse<R>, next: NextFunction) => {
    let ret
    try {
      ret = await controller(req, res)
      res.rawResData = ret
      next()
    } catch (e) {
      res.serverError = e instanceof Error ? e : new Error(e)
      debug(e)
      next()
    }
  }
}
