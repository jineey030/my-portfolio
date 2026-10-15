import { useEffect } from 'react';
import { useLocation } from 'react-router';

// 섹션이 아직 화면에 없을 때 다시 찾아보는 최대 시간
const FIND_TIMEOUT = 2000;

// 위쪽 섹션 데이터가 늦게 도착해 위치가 밀리는 동안 다시 맞춰주는 시간
const SETTLE_TIMEOUT = 1500;

function ScrollToHash() {
  /*
    key는 같은 주소를 다시 눌러도 매번 바뀐다.
    (pathname/hash만 보면 이미 '/#about'에 있을 때 About을 다시 눌러도 반응하지 않음)
  */
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    // 해시가 없는 페이지로 이동하면 최상단으로 (부드러운 스크롤 없이 바로)
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    const id = decodeURIComponent(hash.slice(1));

    let findTimer = 0;
    let settleTimer = 0;
    let resizeObserver: ResizeObserver | null = null;
    let userScrolled = false;

    // 사용자가 직접 스크롤하기 시작하면 더 이상 자동으로 위치를 맞추지 않는다
    const stopFollowing = () => {
      userScrolled = true;
      resizeObserver?.disconnect();
    };

    const scrollToElement = (behavior: ScrollBehavior) => {
      const element = document.getElementById(id);

      if (!element) {
        return false;
      }

      element.scrollIntoView({ behavior, block: 'start' });
      return true;
    };

    /*
      다른 페이지에서 '/#contact'로 오면 Hero / About / Projects가
      스켈레톤 → 실제 내용으로 바뀌면서 높이가 커지고, Contact가 아래로 밀려난다.
      잠시 동안 페이지 높이가 바뀔 때마다 위치를 다시 맞춘다.
    */
    const followLayoutChanges = () => {
      resizeObserver = new ResizeObserver(() => {
        if (!userScrolled) {
          scrollToElement('instant');
        }
      });

      resizeObserver.observe(document.body);

      settleTimer = window.setTimeout(() => {
        resizeObserver?.disconnect();
      }, SETTLE_TIMEOUT);
    };

    const startedAt = Date.now();

    // 섹션을 찾을 때까지 짧은 간격으로 다시 시도
    const tryScroll = () => {
      if (scrollToElement('smooth')) {
        followLayoutChanges();
        return;
      }

      if (Date.now() - startedAt < FIND_TIMEOUT) {
        findTimer = window.setTimeout(tryScroll, 100);
      }
    };

    window.addEventListener('wheel', stopFollowing, { passive: true });
    window.addEventListener('touchmove', stopFollowing, { passive: true });
    window.addEventListener('keydown', stopFollowing);

    tryScroll();

    return () => {
      window.clearTimeout(findTimer);
      window.clearTimeout(settleTimer);
      resizeObserver?.disconnect();

      window.removeEventListener('wheel', stopFollowing);
      window.removeEventListener('touchmove', stopFollowing);
      window.removeEventListener('keydown', stopFollowing);
    };
  }, [pathname, hash, key]);

  return null;
}

export default ScrollToHash;
