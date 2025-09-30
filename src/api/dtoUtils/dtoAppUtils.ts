import { Endpoints } from '@AppServices/apiClient';
import { isInListTypeGuard } from '@AppUtils/typeGuards';
import { parseString } from './dtoCommonUtils';

// ##################################################
// # COMMON APP SPECIFIC PARSERS
// ##################################################

export const parseEndpoint = (
  endpointCandidate: Maybe<string>,
): Endpoints | undefined => {
  const parsedEndpoint = parseString(endpointCandidate);

  if (parsedEndpoint) {
    if (isInListTypeGuard(parsedEndpoint, Object.values(Endpoints))) {
      return parsedEndpoint;
    }
  }
};
