const BASE_URL = 'http://91.219.61.93:3011';

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
      if (response.ok) {
        const data: TData = await response.json();
        return {
          ok: true,
          status: response.status,
          data,
        };
      } else {
        return {
          ok: false,
          status: response.status,
          error: await response.text(),
        };
      }
    })
    .catch((error) => {
      return {
        ok: false,
        status: 0,
        error: 'Network error',
      };
    });
};
