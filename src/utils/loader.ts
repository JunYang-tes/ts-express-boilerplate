import { Express } from "express"
import { parse, ParsedPath } from "path"
import { promisify } from "util"
import * as fs from "fs"
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
// const path = require('path')
const { debug, warn } = require("b-logger")("router.loader")
export function defaultPathStrategy(parsed: ParsedPath) {
  return `/rest/${parsed.name}`
}

export async function scandir(
  path: string,
  predict: (path: string) => boolean,
  handle: (path: string) => any,
  recursive = false
) {
  const ps = [path]
  while (ps.length) {
    const p = ps.pop()
    debug(p);
    if ((await stat(p)).isDirectory()) {
      ps.push(...(await readdir(p)).map(i => `${p}/${i}`))
    } else if (predict(p)) {
      handle(p);
    }
  }
}

export function scandirSync(
  path: string,
  predict: (path: string) => boolean,
  handle: (path: string) => any,
  recursive = false
) {
  const ps = [path]
  while (ps.length) {
    const p = ps.pop()
    if (fs.statSync(p).isDirectory()) {
      ps.push(...fs.readdirSync(p).map(i => `${p}/${i}`))
    } else if (predict(p)) {
      handle(p)
    }
  }
}

export function load(
  app: Express,
  path: string,
  predict: (path: string) => boolean,
  pathStrategy = defaultPathStrategy
) {
  for (const file of fs.readdirSync(path)) {
    if (!predict(`${path}/${file}`)) {
      continue
    }
    debug(`${path}/${file} --> ${pathStrategy(parse(`${path}/${file}`))}`)
    try {
      app.use(
        pathStrategy(parse(`${path}/${file}`)),
        require(`${path}/${file}`)
      );
    } catch (e) {
      warn(`Failed to load ${path}/${file}`, e)
    }
  }
}
