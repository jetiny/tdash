import test from 'ava'

import {Logger, LogLevel, ConsoleLoggerProvider, LoggerProvider} from '../src/logger';

test('logger', async t => {
  const l = new Logger()
  let p = new ConsoleLoggerProvider()
  p.append(new LoggerProvider())
  p.setLoggerLevel(LogLevel.ALL)
  l.setLoggerProvider(p)
  l.debug('debug')
  l.info('info')
  l.warn('warn')
  l.error('error')
  l.module('sub').info('sub-info')

  p.setLoggerLevel(LogLevel.OFF)
  l.info('null-info')
  p.setLoggerLevel(LogLevel.INFO)
  l.debug('null-debug')
  t.pass()
})

test('logger.append', async t => {
  const l = new Logger()
  l.setLoggerLevel(LogLevel.ALL)
  l.append(new ConsoleLoggerProvider())
  l.debug('debug')
  l.info('info')
  l.warn('warn')
  l.error('error')
  l.module('sub').module('child').info('sub-info')

  l.setLoggerLevel(LogLevel.OFF)
  l.info('null')
  l.setLoggerLevel(LogLevel.INFO)
  l.debug('null')
  t.pass()
})
