import {
  notifyAdminDataChanged,
  shouldNotifyAdminChange
} from './adminRefresh';

// 환경 변수가 없으면 'undefined/api/...'로 요청되는 문제 방지 (같은 도메인으로 요청)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? '';

const TOKEN_KEY = 'admin_token';
const ADMIN_LOGIN_PATH = '/admin/login';

/*
  401이 와도 자동 로그아웃하지 않을 API
  - 로그인: 아이디/비밀번호가 틀린 것이지 토큰 만료가 아님
  - 비밀번호 변경: 서버가 "현재 비밀번호 틀림"을 401로 줄 수 있음
*/
const SKIP_AUTO_LOGOUT_PATHS = [
  '/api/auth/login',
  '/api/admin/profile/password'
];

/**
 * 토큰이 만료되었거나 유효하지 않을 때(401) 로그아웃하고
 * 관리자 화면에 있었다면 로그인 화면으로 보낸다.
 */
function handleUnauthorized(path: string) {
  if (
    SKIP_AUTO_LOGOUT_PATHS.some((skip) =>
      path.startsWith(skip)
    )
  ) {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);

  const { pathname } = window.location;

  const isAdminPage =
    pathname === '/admin' ||
    pathname.startsWith('/admin/');

  if (isAdminPage && pathname !== ADMIN_LOGIN_PATH) {
    window.location.replace(ADMIN_LOGIN_PATH);
  }
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const token =
    localStorage.getItem(TOKEN_KEY);

  const headers = new Headers(
    options.headers
  );

  /*
    본문(body)이 있을 때만 Content-Type을 붙인다.
    GET에도 붙이면 브라우저가 모든 요청 앞에 확인 요청(OPTIONS, CORS preflight)을
    한 번 더 보내서, 무료 서버에서는 요청 하나가 두 번 왕복하는 만큼 느려진다.
  */
  if (
    options.body !== undefined &&
    typeof options.body === 'string' &&
    !headers.has('Content-Type')
  ) {
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
      /*
        브라우저가 이전 GET 응답을 재사용하지 않도록 한다.
        (추가/수정 직후 다시 불러올 때 예전 목록이 보이는 문제 방지)
      */
      cache: options.cache ?? 'no-store',
    }
  );

  if (response.status === 401 && token) {
    handleUnauthorized(path);
  }

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
