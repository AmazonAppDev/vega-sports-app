import { isSuccessResponse, buildResponse } from '../utils';

describe('ApiClient service', () => {
  describe('utils', () => {
    describe('isSuccessResponse', () => {
      it('should return true for status 200', () => {
        const response = { status: 200, data: {} };

        const result = isSuccessResponse(response);

        expect(result).toBe(true);
      });

      test.each([
        { inputValue: 400, expectedValue: false },
        { inputValue: 401, expectedValue: false },
        { inputValue: 403, expectedValue: false },
        { inputValue: 500, expectedValue: false },
      ])('should return false for $inputValue status', ({ inputValue }) => {
        const response = { status: inputValue, data: undefined };

        const result = isSuccessResponse(response);

        expect(result).toBe(false);
      });

      test.each([
        { inputValue: undefined, expectedValue: false },
        { inputValue: null, expectedValue: false },
      ])(
        'should return false for unexpected $inputValue status value',
        ({ inputValue }) => {
          const response = { status: inputValue, data: undefined };

          // @ts-expect-error intentionally break TS here
          const result = isSuccessResponse(response);

          expect(result).toBe(false);
        },
      );

      it('should return false for undefined status', () => {
        const response = { status: undefined, data: undefined };

        const result = isSuccessResponse(response);

        expect(result).toBe(false);
      });
    });

    describe('buildResponse', () => {
      it('should build response with the provided data and requestData', () => {
        const response = { status: 200 };
        const data = { key: 'value' };
        const requestData = { method: 'GET', duration: 0 };

        const result = buildResponse(response, data, requestData);

        expect(result).toEqual({
          status: 200,
          method: 'GET',
          duration: 0,
          data: { key: 'value' },
        });
      });

      it('should build response with only response and data when requestData is undefined', () => {
        const response = { status: 200 };
        const data = { key: 'value' };

        const result = buildResponse(response, data);

        expect(result).toEqual({
          status: 200,
          data: { key: 'value' },
        });
      });

      it('should override response properties if provided in requestData', () => {
        const response = {
          status: 200,
        };
        const data = { key: 'value' };
        const requestData = { duration: 450 };

        const result = buildResponse(response, data, requestData);

        expect(result).toEqual({
          status: 200,
          duration: 450,
          data: { key: 'value' },
        });
      });
    });
  });
});
