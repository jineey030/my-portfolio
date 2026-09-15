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

  // JWT가 없거나 만료된 경우
  if (response.status === 401) {
    localStorage.removeItem('admin_token');

    window.location.replace('/admin/login');

    throw new Error(
      '인증이 만료되었습니다. 다시 로그인해주세요.'
    );
  }

  return response;
}
