import { useEffect } from 'react';
import { useLocation } from 'react-router';

function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // 해시가 없는 페이지로 이동하면 최상단으로 이동
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.replace('#', '');

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

    if (scrollToElement()) {
      return;
    }

    const timer = setTimeout(() => {
      scrollToElement();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}

export default ScrollToHash;
