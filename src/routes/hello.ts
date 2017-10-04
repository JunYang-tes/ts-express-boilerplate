import { Router } from "express";
import { api } from "../middleware_creator/api";
import { hello } from "../dao/hello";
const { debug } = require("b-logger")("router.hello");
const router = Router();

router.get(
  "/",
  api(async () => {
    debug("run route /");
    await hello.remove({});
    const doc = await hello.add({
      name: "Hello world"
    });
    return doc;
  })
);

module.exports = router;
