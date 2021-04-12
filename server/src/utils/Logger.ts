import pino from 'pino';
import { Service } from 'typedi';

@Service()
export class Logger {
  private readonly logger = pino({
    enabled: process.env.NODE_ENV !== 'test',
    level: LOG_LEVEL.DEBUG,
    prettyPrint:
      process.env.NODE_ENV === 'development'
        ? {
            levelFirst: true,
            colorize: true,
            translateTime: 'SYS:standard'
          }
        : false
  });

  public trace(message: string): void {
    this.logger[LOG_LEVEL.TRACE](message);
  }

  public debug(message: string): void {
    this.logger[LOG_LEVEL.DEBUG](message);
  }

  public info(message: string): void {
    this.logger[LOG_LEVEL.INFO](message);
  }

  public warn(message: string): void {
    this.logger[LOG_LEVEL.WARN](message);
  }

  public error(message: string): void {
    this.logger[LOG_LEVEL.ERROR](message);
  }

  public fatal(message: string): void {
    this.logger[LOG_LEVEL.FATAL](message);
  }

  public get instance(): pino.Logger {
    return this.logger;
  }
}

enum LOG_LEVEL {
  TRACE = 'trace',
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}
