import { client } from '@/shared/api/base-api';
import { IAuthResponse, ILoginPayload, IRegisterPayload } from './types';

export const register = async (payload: IRegisterPayload) => {
  const response = await client<IAuthResponse>('auth/register', {
    body: JSON.stringify(payload),
  });
  return response;
};

export const login = async (payload: ILoginPayload) => {
  const response = await client<IAuthResponse>('auth/login', { body: JSON.stringify(payload) });
  return response;
};
