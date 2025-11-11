import { JsonLogger } from '../../logger/json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;
  let mockConsoleWarn: jest.SpyInstance;
  let mockConsoleDebug: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation();
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation();
    mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();
    mockConsoleDebug = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    mockConsoleWarn.mockRestore();
    mockConsoleDebug.mockRestore();
  });

  describe('log', () => {
    it('should log message in JSON format', () => {
      const message = 'Test log message';
      
      logger.log(message, 'TestContext');
      
      expect(mockConsoleLog).toHaveBeenCalled();
      
      const logCall = mockConsoleLog.mock.calls[0][0];
      const parsedLog = JSON.parse(logCall);
      
      expect(parsedLog).toMatchObject({
        level: 'LOG',
        message: message,
        context: 'TestContext'
      });
      expect(parsedLog).toHaveProperty('timestamp');
    });

    it('should handle object messages', () => {
      const message = { action: 'test', value: 123 };
      
      logger.log(message, 'ObjectContext');
      
      const logCall = mockConsoleLog.mock.calls[0][0];
      const parsedLog = JSON.parse(logCall);
      
      expect(parsedLog.message).toBe(JSON.stringify(message));
    });

    it('should use default context when not provided', () => {
      const message = 'Test message';
      
      logger.log(message);
      
      const logCall = mockConsoleLog.mock.calls[0][0];
      const parsedLog = JSON.parse(logCall);
      
      expect(parsedLog.context).toBe('Application');
    });
  });

  describe('error', () => {
    it('should error message in JSON format', () => {
      const message = 'Test error message';
      
      logger.error(message, 'ErrorContext', 'Stack trace');
      
      expect(mockConsoleError).toHaveBeenCalled();
      
      const errorCall = mockConsoleError.mock.calls[0][0];
      const parsedError = JSON.parse(errorCall);
      
      expect(parsedError).toMatchObject({
        level: 'ERROR',
        message: message,
        context: 'ErrorContext',
        trace: 'Stack trace'
      });
    });
  });

  describe('warn', () => {
    it('should warn message in JSON format', () => {
      const message = 'Test warn message';
      
      logger.warn(message, 'WarnContext');
      
      expect(mockConsoleWarn).toHaveBeenCalled();
      
      const warnCall = mockConsoleWarn.mock.calls[0][0];
      const parsedWarn = JSON.parse(warnCall);
      
      expect(parsedWarn.level).toBe('WARN');
      expect(parsedWarn.message).toBe(message);
    });
  });

  describe('debug', () => {
    it('should debug message in JSON format', () => {
      const message = 'Test debug message';
      
      logger.debug(message, 'DebugContext');
      
      expect(mockConsoleDebug).toHaveBeenCalled();
      
      const debugCall = mockConsoleDebug.mock.calls[0][0];
      const parsedDebug = JSON.parse(debugCall);
      
      expect(parsedDebug.level).toBe('DEBUG');
      expect(parsedDebug.message).toBe(message);
    });
  });

  describe('verbose', () => {
    it('should verbose message in JSON format', () => {
      const message = 'Test verbose message';
      
      logger.verbose(message, 'VerboseContext');
      
      expect(mockConsoleLog).toHaveBeenCalled();
      
      const verboseCall = mockConsoleLog.mock.calls[0][0];
      const parsedVerbose = JSON.parse(verboseCall);
      
      expect(parsedVerbose.level).toBe('VERBOSE');
      expect(parsedVerbose.message).toBe(message);
    });
  });

  it('should handle special characters in messages', () => {
    const message = 'Message with "quotes" and \'apostrophes\'';
    
    logger.log(message);
    
    const logCall = mockConsoleLog.mock.calls[0][0];
    const parsedLog = JSON.parse(logCall);
    
    expect(parsedLog.message).toBe(message);
  });

  it('should handle multiple optional parameters', () => {
    const message = 'Main message';
    
    logger.log(message, 'Context1', 'Param1', 'Param2');
    
    const logCall = mockConsoleLog.mock.calls[0][0];
    const parsedLog = JSON.parse(logCall);
    
    expect(parsedLog.optionalParams).toEqual(['Context1', 'Param1', 'Param2']);
  });
});