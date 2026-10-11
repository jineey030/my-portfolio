import { useEffect, useState } from 'react';
import './ServerStatusBanner.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

type ServerStatus =
  | 'checking'
  | 'slow'
  | 'timeout'
  | 'backend-error'
  | 'database-error'
  | 'ok';

type HealthResponse = {
  status: 'UP' | 'DB_DOWN';
  database: 'UP' | 'DOWN';
};

function ServerStatusBanner() {
  const [status, setStatus] = useState<ServerStatus>('checking');

  useEffect(() => {
    let active = true;
    let slowTimer: number | undefined;
    let timeoutTimer: number | undefined;
    let controller: AbortController | undefined;

    const checkServer = async () => {
      if (!active) return;

      window.clearTimeout(slowTimer);
      window.clearTimeout(timeoutTimer);
      controller?.abort();

      controller = new AbortController();
      const currentController = controller;

      setStatus('checking');

      slowTimer = window.setTimeout(() => {
        if (active && !currentController.signal.aborted) {
          setStatus((current) =>
            current === 'checking' ? 'slow' : current
          );
        }
      }, 5000);

      timeoutTimer = window.setTimeout(() => {
        currentController.abort();
      }, 20000);

      try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
          method: 'GET',
          signal: currentController.signal,
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`Health API returned ${response.status}`);
        }

        const data: HealthResponse = await response.json();

        if (!active) return;

        if (data.database === 'DOWN' || data.status === 'DB_DOWN') {
          setStatus('database-error');
        } else {
          setStatus('ok');
        }
      } catch (error) {
        if (!active) return;

        if (
          error instanceof Error &&
          error.name === 'AbortError'
        ) {
          setStatus('timeout');
        } else {
          setStatus('backend-error');
        }
      } finally {
        window.clearTimeout(slowTimer);
        window.clearTimeout(timeoutTimer);
      }
    };

    void checkServer();

    // 장애가 발생했다면 60초마다 다시 확인한다.
    const intervalId = window.setInterval(() => {
      if (active) {
        void checkServer();
      }
    }, 60000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
      window.clearTimeout(slowTimer);
      window.clearTimeout(timeoutTimer);
      controller?.abort();
    };
  }, []);

  if (status === 'ok' || status === 'checking') {
    return null;
  }

  const content = {
    slow: {
      title: '서버 응답 대기 중',
      description:
        '무료 서버가 시작되는 중일 수 있습니다. 데이터 로딩에 시간이 걸릴 수 있으니 잠시만 기다려 주세요.',
      icon: '◷',
      className: 'status-slow',
    },
    timeout: {
      title: '서버 응답이 지연되고 있습니다',
      description:
        '서버가 시작 중이거나 응답이 매우 늦을 수 있습니다. 잠시 후 다시 확인해 주세요.',
      icon: '◷',
      className: 'status-slow',
    },
    'backend-error': {
      title: '서버에 연결할 수 없습니다',
      description:
        '백엔드 서버에 연결하지 못했습니다. 일시적인 장애일 수 있습니다. 잠시 후 다시 시도해 주세요.',
      icon: '!',
      className: 'status-error',
    },
    'database-error': {
      title: '데이터베이스 연결에 문제가 있습니다',
      description:
        '서버는 응답하지만 데이터베이스에 연결하지 못했습니다. 일부 데이터가 표시되지 않을 수 있습니다.',
      icon: '!',
      className: 'status-error',
    },
  }[status];

  return (
    <aside
      className={`server-status-banner ${content.className}`}
      role="status"
      aria-live="polite"
    >
      <span className="server-status-icon" aria-hidden="true">
        {content.icon}
      </span>

      <div className="server-status-content">
        <strong>{content.title}</strong>
        <p>{content.description}</p>

        {(status === 'backend-error' ||
          status === 'database-error' ||
          status === 'timeout') && (
          <a href="mailto:jineey.dev@gmail.com">
            문의: jineey.dev@gmail.com
          </a>
        )}
      </div>

      <button
        className="server-status-retry"
        type="button"
        onClick={() => window.location.reload()}
        aria-label="페이지 새로고침"
      >
        다시 시도
      </button>
    </aside>
  );
}

export default ServerStatusBanner;
