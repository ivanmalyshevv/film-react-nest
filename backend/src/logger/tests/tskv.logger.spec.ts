import { TskvLogger } from '../../logger/tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let mockStdoutWrite: jest.SpyInstance;
  let mockStderrWrite: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    
    mockStdoutWrite = jest.spyOn(process.stdout, 'write').mockImplementation();
    mockStderrWrite = jest.spyOn(process.stderr, 'write').mockImplementation();
  });

  afterEach(() => {
    mockStdoutWrite.mockRestore();
    mockStderrWrite.mockRestore();
  });

  describe('log', () => {
    it('should log message in TSKV format', () => {
      const message = 'Test log message';
      
      logger.log(message, 'TestContext');
      
      expect(mockStdoutWrite).toHaveBeenCalled();
      
      const logCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(logCall).toContain('timestamp=');
      expect(logCall).toContain('level=LOG');
      expect(logCall).toContain('message=Test log message');
      expect(logCall).toContain('context=TestContext');
      expect(logCall).toContain('\t');
      expect(logCall.endsWith('\n')).toBe(true);
    });

    it('should use default context when not provided', () => {
      const message = 'Test message';
      
      logger.log(message);
      
      const logCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(logCall).toContain('context=Application');
    });
  });

  describe('error', () => {
    it('should error message in TSKV format to stderr', () => {
      const message = 'Test error message';
      
      logger.error(message, 'ErrorContext', 'Stack trace');
      
      expect(mockStderrWrite).toHaveBeenCalled();
      
      const errorCall = mockStderrWrite.mock.calls[0][0] as string;
      
      expect(errorCall).toContain('level=ERROR');
      expect(errorCall).toContain('message=Test error message');
      expect(errorCall).toContain('context=ErrorContext');
      expect(errorCall).toContain('trace=Stack trace');
    });
  });

  describe('warn', () => {
    it('should warn message in TSKV format', () => {
      const message = 'Test warn message';
      
      logger.warn(message, 'WarnContext');
      
      expect(mockStdoutWrite).toHaveBeenCalled();
      
      const warnCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(warnCall).toContain('level=WARN');
      expect(warnCall).toContain('message=Test warn message');
    });
  });

  describe('debug', () => {
    it('should debug message in TSKV format', () => {
      const message = 'Test debug message';
      
      logger.debug(message, 'DebugContext');
      
      expect(mockStdoutWrite).toHaveBeenCalled();
      
      const debugCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(debugCall).toContain('level=DEBUG');
      expect(debugCall).toContain('message=Test debug message');
    });
  });

  describe('verbose', () => {
    it('should verbose message in TSKV format', () => {
      const message = 'Test verbose message';
      
      logger.verbose(message, 'VerboseContext');
      
      expect(mockStdoutWrite).toHaveBeenCalled();
      
      const verboseCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(verboseCall).toContain('level=VERBOSE');
      expect(verboseCall).toContain('message=Test verbose message');
    });
  });

  describe('escapeValue', () => {
    it('should escape tab characters', () => {
      const message = 'Message\twith\ttabs';
      
      logger.log(message);
      
      const logCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(logCall).toContain('message=Message\\twith\\ttabs');
      expect(logCall).not.toContain('Message\twith\ttabs');
    });

    it('should escape newline characters', () => {
      const message = 'Message\nwith\nnewlines';
      
      logger.log(message);
      
      const logCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(logCall).toContain('message=Message\\nwith\\nnewlines');
      expect(logCall).not.toContain('Message\nwith\nnewlines');
    });

    it('should escape carriage return characters', () => {
      const message = 'Message\rwith\rcarriage';
      
      logger.log(message);
      
      const logCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(logCall).toContain('message=Message\\rwith\\rcarriage');
    });

    it('should escape equals signs', () => {
      const message = 'Message=with=equals';
      
      logger.log(message);
      
      const logCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(logCall).toContain('message=Message\\=with\\=equals');
    });

    it('should escape multiple special characters', () => {
      const message = 'Message\twith\nmultiple\rcharacters=here';
      
      logger.log(message);
      
      const logCall = mockStdoutWrite.mock.calls[0][0] as string;
      
      expect(logCall).toContain('message=Message\\twith\\nmultiple\\rcharacters\\=here');
    });
  });

  it('should handle object messages by converting to string', () => {
    const message = { key: 'value', number: 123 };
    
    logger.log(message);
    
    const logCall = mockStdoutWrite.mock.calls[0][0] as string;
    
    expect(logCall).toContain('message=[object Object]');
  });

  it('should include trace in error logs', () => {
    const message = 'Error message';
    const trace = 'Error: Something went wrong\n    at module (file.js:10:5)';
    
    logger.error(message, 'ErrorContext', trace);
    
    const errorCall = mockStderrWrite.mock.calls[0][0] as string;
    
    expect(errorCall).toContain('trace=Error: Something went wrong\\n    at module (file.js:10:5)');
  });

  it('should maintain TSKV format with exact field structure', () => {
    const message = 'Structured message';
    
    logger.log(message, 'StructuredContext');
    
    const logCall = mockStdoutWrite.mock.calls[0][0] as string;
    const fields = logCall.trim().split('\t');
    
    const fieldMap = new Map();
    fields.forEach(field => {
      const [key, value] = field.split('=');
      fieldMap.set(key, value);
    });
    
    expect(fieldMap.has('timestamp')).toBe(true);
    expect(fieldMap.has('level')).toBe(true);
    expect(fieldMap.has('message')).toBe(true);
    expect(fieldMap.has('context')).toBe(true);
    expect(fieldMap.get('level')).toBe('LOG');
    expect(fieldMap.get('context')).toBe('StructuredContext');
  });
});