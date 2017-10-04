import * as http from "http"
import * as express from "express"
import * as bodyParser from "body-parser"
import * as methodOverride from "method-override"
import * as cookieParser from "cookie-parser"
import { APIHander } from "./middleware_creator/APIHander"
import { load } from "./utils/loader"
import { config } from "./config"
const { error, info } = require("b-logger")("app")
require("./dao");

info(process.env.NODE_ENV)
if (config.isDev) {
  info("Running in dev mode")
}else {
  info("Running in prod mode")
}
process.on("uncaughtException", error)

const app = express()
app.set("port", process.env.PORT || 8000)
http.createServer(app).listen(app.get("port"), () => {
  info(`Server running @ ${app.get("port")}`)
})

app.use(methodOverride("X-HTTP-Method-Override"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
load(
  app,
  `${__dirname}/routes`,
  (filepath: string) =>
    config.isDev ? filepath.endsWith(".ts") : filepath.endsWith(".js")
);
app.use("/rest", APIHander("1.0.0", !!process.env.DEBUG));
