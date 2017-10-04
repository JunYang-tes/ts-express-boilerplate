import { DAOBase } from "./dao";
export interface Hello {
  name: string
}
export const hello = new DAOBase<Hello>("hello", {
  name: String
})
