import { useEffect } from 'react';
import { useLocation } from 'react-router';

function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.replace('#', '');

    // Introduce 페이지가 렌더링된 후
    // 해당 id를 가진 요소를 찾음
    const scrollToElement = () => {
      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        return true;
      }

      return false;
    };

    // 바로 찾을 수 있으면 이동
    if (scrollToElement()) {
      return;
    }

    // 페이지 렌더링 타이밍을 고려해서 한 번 더 시도
    const timer = setTimeout(() => {
      scrollToElement();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [hash]);

  return null;
}

export default ScrollToHash;