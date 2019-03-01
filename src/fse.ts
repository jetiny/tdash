import { WriteFileOptions, PathLike } from 'fs'
import { isObject } from './types';

const fs = require('fs')
const path = require('path')

export function writeFileAsync (file: PathLike, data: any , opts?: WriteFileOptions) : Promise<PathLike> {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, opts || {}, (err: any) => {
      if (err) {
        return reject(err)
      }
      resolve(file)
    })
  })
}

export function readFileAsync(file: PathLike, opts?:any) : Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(file, opts, (err: any, data: string | Buffer) => {
      if (err) {
        return reject(err)
      }
      let format = isObject(opts) ? opts.format : null
      if (format == 'text') {
        return resolve(data.toString())
      }
      if (format == 'json') {
        let ret
        try {
          ret = JSON.parse(data.toString())
        } catch (err) {
          return reject(err)
        }
        return resolve(ret)
      }
      return resolve(data)
    })
  })
}

export function copyFileAsync (src: PathLike, dest: PathLike, flags?: number) : Promise<PathLike> {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, flags || 0, (err: any) => {
      if (err) {
        return reject(err)
      }
      resolve(dest)
    })
  })
}

export function removeFileAsync (src: PathLike) : Promise<PathLike> {
  return new Promise((resolve, reject) => {
    fs.unlink(src, (err: any) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve()
        }
        return reject(err)
      }
      resolve(src)
    })
  })
}

export function moveFileAsync (src: PathLike, dest: PathLike) : Promise<PathLike> {
  return new Promise((resolve, reject) => {
    fs.rename(src, dest, (err: any) => {
      if (err) {
        return reject(err)
      }
      resolve(dest)
    })
  })
}

export function existsAsync (src: PathLike, mode?: number) : Promise<boolean> {
  return new Promise((resolve, reject) => {
    fs.access(src, mode || fs.constants.F_OK, (err: any) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return resolve(false)
        }
        return reject(err)
      }
      resolve(true)
    })
  })
}

export function existsSync (src: PathLike, mode?: number) : boolean {
  try {
    fs.accessSync(src, mode || fs.constants.F_OK)
    return true
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
    throw err
  }
}

interface Objects {
    [key:string]: any;
}

export function readDirAsync (dir: PathLike, opts?: any) : Promise<any>{
  return new Promise((resolve, reject) => {
    let {
        exclude, // string | string []
        join, // boolean
        fullPath, // boolean
        map // boolean
    } = (opts || <any>{})
    fs.readdir(dir, opts, (err: any, dirs: string[]) => {
      if (err) {
        return reject(err)
      }
      if (exclude) {
        if (!Array.isArray(exclude)) {
          exclude = exclude.split('|')
        }
        dirs = dirs.filter(it => !exclude.some((t: string) => it.indexOf(t) !== -1))
      }
      let ret
      if (join || fullPath) {
        ret = dirs.map(it => fullPath ? path.resolve(<string>dir, it) : path.join(<string>dir, it))
        if (map) {
          resolve(ret.reduce((dist : Objects, path, id) => {
            dist[dirs[id]] = path
            return dist
          }, {}))
        }
      }
      resolve(dirs)
    })
  })
}
