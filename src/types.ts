
function toStringType (val: any) : string {
  return Object.prototype.toString.call(val).slice(8, -1)
}

export const isArray = Array.isArray

export function isBoolean (arg: any) : boolean {
  return typeof arg === 'boolean'
}

export function isString (arg: any) : boolean {
  return typeof arg === 'string'
}

export function isFunction (arg: any) : boolean {
  return typeof arg === 'function'
}

export function isObject (arg: any) : boolean {
  return (toStringType(arg) === 'Object') && (arg !== null)
}

export function isNumber (arg: any) : boolean {
  return typeof arg === 'number' && !isNaN(arg)
}

export function isInteger (arg: any) : boolean {
  return isNumber(arg) && parseInt(arg) === arg
}

export function isUndefined (arg: any) : boolean {
  return arg === undefined
}

export function isNull (arg: any) : boolean {
  return arg === null
}

export function isNan (arg: any) : boolean {
  return typeof arg === 'number' && isNaN(arg)
}

export function isRegExp (arg: any) : boolean {
  return toStringType(arg) === 'RegExp'
}

export function isDate (arg: any) : boolean {
  return toStringType(arg) === 'Date'
}

export function typeName (arg: any) : string {
  if (isNan(arg)) {
    return 'Nan'
  }
  switch (arg) {
    case undefined:
      return 'Undefined'
    case null:
      return 'Null'
    default:
      return toStringType(arg)
  }
}

export const isInt = isInteger
export function isUint (arg: any) : boolean {
  return isInteger(arg) && arg >= 0
}

// export function isAsync (func: any) : boolean {
//   return isFunction(func) && func.constructor.name === 'AsyncFunction'
// }

export function isPromise (obj: any) : boolean {
  return obj && isFunction(obj.then)
}
