import { Navigate, Outlet } from 'react-router';

const TOKEN_KEY = 'admin_token';

/**
 * JWT의 만료 시간(exp)을 확인한다.
 * - JWT가 아니거나 exp가 없으면 판단할 수 없으므로 "만료 아님"으로 본다.
 *   (그 경우 실제 만료 여부는 서버가 401로 알려준다)
 */
function isTokenExpired(token: string) {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return false;
    }

    // base64url → base64 변환 후 디코딩
    const base64 = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const { exp } = JSON.parse(atob(base64)) as {
      exp?: number;
    };

    if (typeof exp !== 'number') {
      return false;
    }

    // exp는 초 단위, Date.now()는 밀리초 단위
    return exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

function AdminRoute() {
  const token = localStorage.getItem(TOKEN_KEY);

  // 예전 로그인 버그로 "undefined" 문자열이 저장된 경우도 로그아웃 처리
  const isValidToken =
    !!token &&
    token !== 'undefined' &&
    token !== 'null' &&
    !isTokenExpired(token);

  if (!isValidToken) {
    localStorage.removeItem(TOKEN_KEY);

    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

export default AdminRoute;
