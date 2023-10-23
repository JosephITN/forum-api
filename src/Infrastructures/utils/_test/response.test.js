/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const {
  successResponse,
  failResponse,
  errorResponse,
} = require('../response');

const mockHeader = {
  response: (data) => ({
    ...data,
    code: (code) => {
      if (code) return code;
      return 200;
    },
  }),
};
describe('JwtTokenManager', () => {
  it('should response success correctly', async () => {
    const response = successResponse(mockHeader, 'success');
    expect(response.status)
      .toBeDefined();
    expect(response.status)
      .toEqual('success');
    expect(response.message)
      .toBeDefined();
    expect(response.message)
      .toEqual('success');
  });
  it('should response success with data correctly', async () => {
    const mockData = { accessToken: 's089fj9sdf8' };
    const response = successResponse(mockHeader, null, mockData);
    expect(response.data)
      .toBeDefined();
    expect(response.data)
      .toEqual(mockData);
  });
  it('should response failed correctly', async () => {
    const response = failResponse(mockHeader, 'fail');
    expect(response.status)
      .toBeDefined();
    expect(response.status)
      .toEqual('fail');
    expect(response.message)
      .toBeDefined();
    expect(response.message)
      .toEqual('fail');
  });
  it('should response failed with data correctly', async () => {
    const mockData = { accessToken: 's089fj9sdf8' };
    const response = failResponse(mockHeader, null, 400, mockData);
    expect(response.data)
      .toBeDefined();
    expect(response.data)
      .toEqual(mockData);
  });
  it('should response error correctly', async () => {
    const response = errorResponse(mockHeader, 'error');
    expect(response.status)
      .toBeDefined();
    expect(response.status)
      .toEqual('error');
    expect(response.message)
      .toBeDefined();
    expect(response.message)
      .toEqual('error');
  });
  it('should response error with data correctly', async () => {
    const mockData = { accessToken: 's089fj9sdf8' };
    const response = errorResponse(mockHeader, null, 502, mockData);
    expect(response.data)
      .toBeDefined();
    expect(response.data)
      .toEqual(mockData);
  });
});
