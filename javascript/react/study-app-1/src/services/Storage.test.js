import storage from './Storage';

describe('Storage Service', () => {
  it('should expose save method', () => {
    expect(storage.saveItem).toBeDefined();
  });

  it('should expose getItem method', () => {
    expect(storage.getItem).toBeDefined();
  });

  it('should invoke localStorage.setItem when saving', () => {
    global.localStorage = {setItem: jest.fn()};
    const key = 'test';
    const value = {"status": "OK"};
    storage.saveItem(key, value);
    expect(global.localStorage.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
  });

  it('should invoke localStorage.getItem when getItem', () => {
    global.localStorage = {getItem: jest.fn()};
    const key = 'test';
    const value = {"status": "OK"};
    storage.getItem(key);
    expect(global.localStorage.getItem).toHaveBeenCalledWith(key);
  });

  it('should return parsed JSON value when stored item is an stringified object', () => {
    const key = 'test';
    const value = {"status": "OK"};
    global.localStorage = {getItem: () => JSON.stringify(value)};
    const returnedValue = storage.getItem(key);
    expect(returnedValue).toEqual(value);
  });

  it('should return string value when stored item is a string', () => {
    const key = 'test';
    const value = "TEST";
    global.localStorage = {getItem: () => value};
    const returnedValue = storage.getItem(key);
    expect(typeof returnedValue).toEqual('string');
    expect(returnedValue).toEqual(value);
  });
});
