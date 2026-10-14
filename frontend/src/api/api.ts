import {
  notifyAdminDataChanged,
  shouldNotifyAdminChange
} from './adminRefresh';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token =
    localStorage.getItem('admin_token');

  const headers = new Headers(
    options.headers
  );

  if (!headers.has('Content-Type')) {
    headers.set(
      'Content-Type',
      'application/json'
    );
  }

  if (token) {
    headers.set(
      'Authorization',
      `Bearer ${token}`
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
    }
  );

  // /admin에서 데이터가 바뀌면 화면 데이터 자동 새로고침
  if (
    shouldNotifyAdminChange(
      path,
      options.method,
      response.ok
    )
  ) {
    notifyAdminDataChanged();
  }

  return response;
}
