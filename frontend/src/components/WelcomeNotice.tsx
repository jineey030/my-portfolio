import { useEffect, useState } from 'react';
import './WelcomeNotice.css';

const SESSION_KEY = 'yejin-portfolio-notice-shown';

function WelcomeNotice() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const hasSeenNotice = sessionStorage.getItem(SESSION_KEY);

      if (!hasSeenNotice) {
        setIsOpen(true);
      }
    } catch {
      // 브라우저에서 sessionStorage를 사용할 수 없는 경우에도 안내 팝업은 표시
      setIsOpen(true);
    }
  }, []);

  const closeNotice = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      // 저장할 수 없어도 현재 화면에서는 닫는다.
    }

    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="welcome-notice-overlay"
      onClick={closeNotice}
    >
      <section
        className="welcome-notice"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-notice-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="welcome-notice-icon" aria-hidden="true">
          <span>i</span>
        </div>

        <p className="welcome-notice-eyebrow">
          YEJIN'S PORTFOLIO
        </p>

        <h2 id="welcome-notice-title">
          방문해 주셔서 감사합니다!
        </h2>

        <p className="welcome-notice-description">
          이 포트폴리오는 무료 서버로 운영되고 있어
          첫 접속 시 데이터 로딩이 다소 지연될 수 있습니다.
        </p>

        <p className="welcome-notice-description">
          데이터가 표시되지 않거나 문제가 지속된다면
          아래 이메일로 알려주세요.
        </p>

        <a
          className="welcome-notice-email"
          href="mailto:jineey.dev@gmail.com"
        >
          <span aria-hidden="true">✉</span>
          jineey.dev@gmail.com
        </a>

        <button
          className="welcome-notice-confirm"
          type="button"
          onClick={closeNotice}
        >
          확인
        </button>
      </section>
    </div>
  );
}

export default WelcomeNotice;
