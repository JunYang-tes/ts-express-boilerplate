import { DAOBase } from "./dao";
export interface Hello {
  name: string,
  order: number
}
export const hello = new DAOBase<Hello>("hello", {
  name: String,
  order: Number
})
