import { Paging } from "../types"
export function page2QueryOpt(paging: Paging) {
  return {
    skip: ((+paging.pageNum - 1) * +paging.pageSize),
    limit: +paging.pageSize
  }
}
export function random(min = 0, max = 1) {
  return Math.random() * (max - min) + min
}