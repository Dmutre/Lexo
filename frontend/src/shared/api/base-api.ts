import { refreshTokenApi } from '@/entities/user/api/user-api';

export const BASE_URL = 'http://91.219.61.93:3011';

export type ApiResponse<TData> =
  | {
      ok: boolean;
      status: number;
      data?: TData;
      error?: string;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

export const client = async <TData>(
  endpoint: string,
  customOptions: RequestInit = {},
  isRetry = false,
): Promise<ApiResponse<TData>> => {
  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const config = {
    method: customOptions.body ? 'POST' : 'GET',
    ...customOptions,
    headers: {
      ...headers,
      ...customOptions.headers,
    },
  };

  return fetch(`${BASE_URL}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401 && !isRetry) {
        const res = await refreshTokenApi();
        if (res.ok && res.data) {
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          return client<TData>(endpoint, config, true);
        }
      }

      const data: TData = await response.json();

      return {
        ok: response.ok,
        status: response.status,
        ...(response.ok ? { data } : { error: await response.text() }),
      };
    })
    .catch((error) => {
      return {
        ok: false,
        status: 0,
        error: 'Network error',
      };
    });
};
