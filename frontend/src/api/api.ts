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

  return fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      headers,
    }
  );
}