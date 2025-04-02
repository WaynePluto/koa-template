import { Middleware } from 'koa'
import winston from 'winston'

import DailyRotateFile from 'winston-daily-rotate-file'

export const createLogger = () => {
  const { IS_DEV } = process.env

  const transport: DailyRotateFile = new DailyRotateFile({
    auditFile: 'logs/log-audit.json',
    filename: 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '30d',
  })

  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      ...[
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(i => `>${i.level}:${i.timestamp}: ${JSON.stringify(i.message)}\n`),
      ],
    ),
    transports: IS_DEV ? [new winston.transports.Console()] : [transport],
  })

  return logger
}

export const initLogger = (logger: winston.Logger): Middleware => {
  return async (ctx, next) => {
    ctx.logger = logger
    const time = Date.now()
    const { url, method, request } = ctx
    await next()
    logger.info({ url, method, data: request.body, body: ctx.body, time: ` ${Date.now() - time}ms`, ip: request.ip })
  }
}
