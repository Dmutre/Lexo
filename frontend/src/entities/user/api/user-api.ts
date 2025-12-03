import { client } from '@/shared/api/base-api';
import { IMeResponse } from './types';

export const meApi = async () => {
  const response = await client<IMeResponse>('auth/me');
  return response;
};
