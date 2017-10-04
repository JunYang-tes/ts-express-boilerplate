import { Document, connect } from "mongoose"
import { config } from "../config"
const { debug, error } = require("b-logger")("db")

connect(
  `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`,
  { useMongoClient: true, promiseLibrary: Promise },
  err => {
    if (err) {
      error("Failed to connect db")
      error(err)
    } else {
      debug("db connected")
    }
  }
)
