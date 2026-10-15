import { useEffect, useRef, useState } from 'react';

/**
 * /admin 페이지에서 데이터가 추가/수정/삭제되면
 * 화면의 데이터를 다시 불러오도록 알리는 이벤트.
 *
 * apiFetch가 성공한 변경 요청(POST/PUT/PATCH/DELETE) 뒤에
 * 자동으로 발생시키므로, 각 페이지는 구독만 하면 된다.
 */
const ADMIN_DATA_CHANGED = 'admin-data-changed';
const MUTATION_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];
const IGNORED_PATHS = ['/api/auth/login', '/api/ai'];

let pendingTimer: ReturnType<typeof setTimeout> | null = null;

export function notifyAdminDataChanged() {
  if (typeof window === 'undefined') return;

  // 연속된 요청은 한 번의 새로고침으로 묶는다.
  if (pendingTimer) clearTimeout(pendingTimer);

  pendingTimer = setTimeout(() => {
    pendingTimer = null;
    window.dispatchEvent(new Event(ADMIN_DATA_CHANGED));
  }, 150);
}

// '/admin' 또는 '/admin/...'만 관리자 화면으로 본다. ('/administrator' 같은 주소 제외)
function isAdminPath(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/');
}

export function shouldNotifyAdminChange(
  path: string,
  method: string | undefined,
  ok: boolean
) {
  if (!ok || typeof window === 'undefined') return false;
  if (!isAdminPath(window.location.pathname)) return false;
  if (!MUTATION_METHODS.includes((method ?? 'GET').toUpperCase())) {
    return false;
  }

  return !IGNORED_PATHS.some((ignored) => path.startsWith(ignored));
}

/** 데이터 변경 시 콜백을 다시 실행한다. (화면 상태는 유지) */
export function useAdminRefresh(callback: () => void) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    const handler = () => callbackRef.current();

    window.addEventListener(ADMIN_DATA_CHANGED, handler);
    return () => window.removeEventListener(ADMIN_DATA_CHANGED, handler);
  }, []);
}

/** 데이터 변경 시마다 1씩 증가하는 값. useEffect 의존성에 넣어 사용한다. */
export function useAdminRefreshKey() {
  const [refreshKey, setRefreshKey] = useState(0);

  useAdminRefresh(() => setRefreshKey((key) => key + 1));

  return refreshKey;
}
