import { LoggerService, Injectable } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const timestamp = new Date().toISOString();
    const context = optionalParams[0] || 'Application';
    const trace = optionalParams[1] || '';

    const fields = [
      `timestamp=${timestamp}`,
      `level=${level}`,
      `message=${this.escapeValue(String(message))}`,
      `context=${context}`,
    ];

    if (trace) {
      fields.push(`trace=${this.escapeValue(trace)}`);
    }

    return fields.join('\t') + '\n';
  }

  private escapeValue(value: string): string {
    return value
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\=/g, '\\=');
  }

  log(message: any, ...optionalParams: any[]) {
    process.stdout.write(this.formatMessage('LOG', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    process.stderr.write(
      this.formatMessage('ERROR', message, ...optionalParams),
    );
  }

  warn(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('WARN', message, ...optionalParams),
    );
  }

  debug(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('DEBUG', message, ...optionalParams),
    );
  }

  verbose(message: any, ...optionalParams: any[]) {
    process.stdout.write(
      this.formatMessage('VERBOSE', message, ...optionalParams),
    );
  }
}
