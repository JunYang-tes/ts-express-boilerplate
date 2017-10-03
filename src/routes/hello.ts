import {Router} from "express"
import {api} from "../middleware_creator/api"
const router = Router()
router.get('/',api(()=>"hello word"))

module.exports=router