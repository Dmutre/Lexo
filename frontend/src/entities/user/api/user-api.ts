import { BASE_URL, client } from '@/shared/api/base-api';
import { IMeResponse } from './types';

export const meApi = async () => {
  const response = await client<IMeResponse>('auth/me');
  return response;
};

export const refreshTokenApi = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const response = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  });

  const data = await response.json();

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
};
