import { LoggerFactory } from '../../logger/logger.factory';
import { DevLogger } from '../../logger/dev.logger';
import { JsonLogger } from '../../logger/json.logger';
import { TskvLogger } from '../../logger/tskv.logger';

describe('LoggerFactory', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe('createLogger', () => {
    it('should create DevLogger by default', () => {
      delete process.env.LOGGER_TYPE;
      
      const logger = LoggerFactory.createLogger();
      
      expect(logger).toBeInstanceOf(DevLogger);
    });

    it('should create DevLogger when LOGGER_TYPE=dev', () => {
      process.env.LOGGER_TYPE = 'dev';
      
      const logger = LoggerFactory.createLogger();
      
      expect(logger).toBeInstanceOf(DevLogger);
    });

    it('should create JsonLogger when LOGGER_TYPE=json', () => {
      process.env.LOGGER_TYPE = 'json';
      
      const logger = LoggerFactory.createLogger();
      
      expect(logger).toBeInstanceOf(JsonLogger);
    });

    it('should create TskvLogger when LOGGER_TYPE=tskv', () => {
      process.env.LOGGER_TYPE = 'tskv';
      
      const logger = LoggerFactory.createLogger();
      
      expect(logger).toBeInstanceOf(TskvLogger);
    });

    it('should create DevLogger for unknown logger type', () => {
      process.env.LOGGER_TYPE = 'unknown';
      
      const logger = LoggerFactory.createLogger();
      
      expect(logger).toBeInstanceOf(DevLogger);
    });
  });
});