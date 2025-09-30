import { Endpoints } from '@AppServices/apiClient/types';
import { parseEndpoint } from '../dtoAppUtils';

describe('dtoAppUtils', () => {
  describe('parseEndpoint', () => {
    // Valid endpoint cases
    test.each(
      Object.entries(Endpoints).map((entry) => ({
        endpointCandidate: entry[1],
        expected: entry[1],
      })),
    )(
      'should return the parsed endpoint ($expected) when the input is valid ($endpointCandidate)',
      ({ endpointCandidate, expected }) => {
        expect(parseEndpoint(endpointCandidate)).toEqual(expected);
      },
    );

    // Invalid endpoint cases
    test.each([
      { endpointCandidate: 'invalidEndpoint' },
      { endpointCandidate: 'unknownlayout' },
      { endpointCandidate: 'randomstring' },
    ])(
      'should return undefined when the input is not in the Endpoints list ($endpointCandidate)',
      ({ endpointCandidate }) => {
        expect(parseEndpoint(endpointCandidate)).toBeUndefined();
      },
    );

    // Nullable input cases
    test.each([{ endpointCandidate: null }, { endpointCandidate: undefined }])(
      'should return undefined when the input is nullable ($endpointCandidate)',
      ({ endpointCandidate }) => {
        expect(parseEndpoint(endpointCandidate)).toBeUndefined();
      },
    );

    // TypeScript-violating input cases
    test.each([
      { endpointCandidate: 123 },
      { endpointCandidate: true },
      { endpointCandidate: {} },
      { endpointCandidate: [] },
    ])(
      'should return undefined when the input violates TS and is not a string ($endpointCandidate)',
      ({ endpointCandidate }) => {
        // @ts-expect-error intentionally testing invalid TS inputs
        expect(parseEndpoint(endpointCandidate)).toBeUndefined();
      },
    );

    // Edge case: TypeScript valid but edge-case input
    test.each([
      { endpointCandidate: '', expected: undefined },
      { endpointCandidate: ' ', expected: undefined },
    ])(
      'should return undefined when the input is a string but not a valid endpoint ($endpointCandidate)',
      ({ endpointCandidate, expected }) => {
        expect(parseEndpoint(endpointCandidate)).toBe(expected);
      },
    );
  });
});
