import { DevLogger } from '../../logger/dev.logger';

describe('DevLogger', () => {
  let logger: DevLogger;
  let mockConsoleLog: jest.SpyInstance;
  let mockConsoleError: jest.SpyInstance;
  let mockConsoleWarn: jest.SpyInstance;
  let mockConsoleDebug: jest.SpyInstance;

  beforeEach(() => {
    logger = new DevLogger('TestContext');
    
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

  it('should log message with context', () => {
    const message = 'Test log message';
    
    logger.log(message);
    
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('TestContext'),
      expect.stringContaining(message)
    );
  });

  it('should error message with context', () => {
    const message = 'Test error message';
    
    logger.error(message);
    
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('TestContext'),
      expect.stringContaining(message)
    );
  });

  it('should warn message with context', () => {
    const message = 'Test warn message';
    
    logger.warn(message);
    
    expect(mockConsoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('TestContext'),
      expect.stringContaining(message)
    );
  });

  it('should debug message with context', () => {
    const message = 'Test debug message';
    
    logger.debug(message);
    
    expect(mockConsoleDebug).toHaveBeenCalledWith(
      expect.stringContaining('TestContext'),
      expect.stringContaining(message)
    );
  });

  it('should verbose message with context', () => {
    const message = 'Test verbose message';
    
    logger.verbose(message);
    
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('TestContext'),
      expect.stringContaining(message)
    );
  });

  it('should handle object messages', () => {
    const message = { key: 'value', number: 123 };
    
    logger.log(message);
    
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('TestContext'),
      expect.any(String)
    );
  });

  it('should handle multiple parameters', () => {
    const message = 'Main message';
    const additionalParam = 'Additional info';
    
    logger.log(message, additionalParam);
    
    expect(mockConsoleLog).toHaveBeenCalledWith(
      expect.stringContaining('TestContext'),
      expect.stringContaining(message),
      additionalParam
    );
  });

  describe('without context', () => {
    beforeEach(() => {
      logger = new DevLogger();
    });

    it('should log message without specific context', () => {
      const message = 'Test message without context';
      
      logger.log(message);
      
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.any(String),
        message
      );
    });
  });
});