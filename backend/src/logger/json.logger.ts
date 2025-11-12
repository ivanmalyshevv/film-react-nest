import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const logEntry: any = {
      timestamp: new Date().toISOString(),
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
    };

    if (optionalParams[0]) {
      logEntry.context = optionalParams[0];
    }

    if (optionalParams[1] && level === 'ERROR') {
      logEntry.trace = optionalParams[1];
    }

    return JSON.stringify(logEntry);
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('LOG', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('ERROR', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('WARN', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('DEBUG', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('VERBOSE', message, ...optionalParams));
  }
}