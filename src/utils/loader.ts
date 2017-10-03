import {Express} from "express"
import {parse,ParsedPath} from "path"
const fs = require('fs')
// const path = require('path')
const { debug, warn } = require("b-logger")("router.loader")
export function defaultPathStrategy(parsed:ParsedPath) {
  return `/rest/${parsed.name}`;
}
export function load(app:Express,
  path:string,
  predict:(path:string)=>boolean,
  pathStrategy=defaultPathStrategy
){
  for(const file of fs.readdirSync(path)){
    if(!predict(`${path}/${file}`)){
      continue
    }
    debug(`${path}/${file} --> ${pathStrategy(parse(`${path}/${file}`))}`)
    try{
      app.use(pathStrategy(parse(`${path}/${file}`)), require(`${path}/${file}`))
    }catch(e){
      warn(`Failed to load ${path}/${file}`,e)
    }
  }
}
