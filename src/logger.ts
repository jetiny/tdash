
export enum LogLevel {
  ALL,
  DEBUG,
  INFO,
  WARN,
  ERROR,
  FATAL,
  OFF = 100,
}

export interface ILogger {
  debug(message?: any, ...optionalParams: any[]) : void
  info(message?: any, ...optionalParams: any[]) : void
  warn(message?: any, ...optionalParams: any[]) : void
  error(message?: any, ...optionalParams: any[]) : void
  module(module: string): ILogger
}

export interface ILoggerHandler {
  logger() : ILogger
}

export interface ILoggerProvider {
  write(module: string, level: LogLevel, args: any) : void
  append(provider: ILoggerProvider) : void
  setLoggerLevel(level: LogLevel) : void
}

export class LoggerProvider implements ILoggerProvider {
  write(module: string, level: LogLevel, args: any) {
    if (this._level == LogLevel.OFF) {
      return
    }
    if (this._level <= level) {
      this._write(module, level, args)
    }
    this._providers.forEach(it => it.write(module, level, args))
  }
  append(provider: ILoggerProvider) {
    this._providers.push(provider)
  }
  setLoggerLevel(level: LogLevel) {
    this._level = level
  }
  protected _write(_: string, __: LogLevel, ___: any) {}
  private _providers: Array<ILoggerProvider> = []
  private _level: LogLevel = LogLevel.INFO
}

export class Logger extends LoggerProvider implements ILogger {
  constructor (module: string = "", provider?: ILoggerProvider) {
    super()
    this._module = module
    this._provider = provider || this
  }
  debug(_?: any, ...__: any[]) {
    this._log(LogLevel.DEBUG, arguments)
  }
  info(_?: any, ...__: any[]) {
    this._log(LogLevel.INFO, arguments)
  }
  warn(_?: any, ...__: any[]) {
    this._log(LogLevel.WARN, arguments)
  }
  error(_?: any, ...__: any[]) {
    this._log(LogLevel.ERROR, arguments)
  }
  module(module: string): ILogger {
    return new Logger(`${this._module ? (this._module + '.' + module) : module}`, this._provider)
  }
  setLoggerProvider(provider: ILoggerProvider) {
    this._provider = provider
  }
  private _module: string = ''
  private _provider: ILoggerProvider
  private _log(level: LogLevel, args: any) {
    this._provider.write(this._module, level, args)
  }
}

export class ConsoleLoggerProvider extends LoggerProvider {
  protected _write(module: string, level: LogLevel, args: any) {
    switch(level) {
      case LogLevel.DEBUG:
        console.debug(new Date(), LogLevel[level], module, ...args)
        break
      case LogLevel.INFO:
        console.info(new Date(), LogLevel[level], module, ...args)
        break
      case LogLevel.WARN:
        console.warn(new Date(), LogLevel[level], module, ...args)
        break
      case LogLevel.ERROR:
        console.error(new Date(), LogLevel[level], module, ...args)
        break
    }
  }
}
