import {
  ApiClient,
  Endpoints,
  isSuccessResponse,
} from '@AppServices/apiClient';
import type { AuthDto } from './dtos/AuthDto';
import { parseAuthDto } from './dtos/AuthDto';
import staticData from './staticData/auth.json';

export type SignInParams = {
  email: string;
  password: string;
};

const endpoint = Endpoints.Auth;
export const postSignIn = async (params: SignInParams) => {
  const response = await ApiClient.post<AuthDto>(
    endpoint,
    { staticData },
    { params },
  );

  if (!isSuccessResponse(response)) {
    switch (response.status) {
      case 400:
        throw new Error(
          `postSignIn(): resources does not exists for endpoint '${endpoint}'`,
        );

      default:
        throw new Error(
          `postSignIn(): failed to received data from endpoint '${endpoint}'`,
        );
    }
  }

  return parseAuthDto(response.data);
};
