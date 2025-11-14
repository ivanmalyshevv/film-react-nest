import { TskvLogger } from './tskv.logger';

describe.only('TskvLogger', () => {
  let log;
  const tskvLogger = new TskvLogger();

  beforeEach(() => {
    log = jest.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    log.mockReset();
  });

  it('should log correct format', () => {
    tskvLogger.warn('hello', { a: 'b', c: 1 });
    expect(log).toBeCalledTimes(1);
    expect(log).toBeCalledWith(
      'level=warn\tmessage=hello\toptional=[[{"a":"b","c":1}]]',
    );
  });
});
