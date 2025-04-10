import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';

const loggerFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), loggerFormat),
  transports: [
    process.env.ENV === 'production'
      ? new winston.transports.File({
          filename: 'error.log',
          level: 'warn',
          format: winston.format.combine(
            winston.format.timestamp(),
            loggerFormat,
          ),
        })
      : new winston.transports.Console({
          level: 'debug',
          format: winston.format.combine(
            winston.format.colorize(),
            loggerFormat,
          ),
        }),
  ],
});

@Injectable()
export class WinstonLoggerService implements LoggerService {
  log(message: string) {
    logger.info(message);
  }

  error(message: string, trace: string) {
    logger.error(`${message} - ${trace}`);
  }

  warn(message: string) {
    logger.warn(message);
  }

  debug(message: string) {
    logger.debug(message);
  }

  verbose(message: string) {
    logger.verbose(message);
  }
}
