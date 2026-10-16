import { useEffect } from 'react';

const AI_API_BASE_URL = import.meta.env.VITE_AI_API_BASE_URL ?? '';

/**
 * 페이지에 들어오자마자 AI 서버의 /health를 호출해서 잠들어 있는 AI 서버를 미리 깨운다..
 */
export function useWarmUpAiServer(enabled: boolean) {
  useEffect(() => {
    if (!enabled || !AI_API_BASE_URL) return;

    const controller = new AbortController();

    fetch(`${AI_API_BASE_URL}/health`, {
      method: 'GET',
      cache: 'no-store',
      signal: controller.signal,
    }).catch(() => {
      // 깨우기 용도이므로 실패해도 무시한다.
    });

    return () => controller.abort();
  }, [enabled]);
}
