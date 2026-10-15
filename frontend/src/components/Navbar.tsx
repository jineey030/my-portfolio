import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

// 고정 헤더 높이 + 여유. 이 위치를 지나면 해당 섹션을 "현재 섹션"으로 본다
const ACTIVE_OFFSET = 120;

function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  // 현재 보고 있는 섹션 표시
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    let frameId = 0;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + ACTIVE_OFFSET;

      const pageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      if (pageBottom) {
        setActiveSection('contact');
        return;
      }

      let currentSection = '';

      for (const item of NAV_ITEMS) {
        const section = document.getElementById(item.id);

        if (!section) {
          continue;
        }

        if (scrollPosition >= section.offsetTop) {
          currentSection = item.id;
        }
      }

      setActiveSection(currentSection);
    };

    // 스크롤 이벤트는 아주 자주 발생하므로 화면 그리는 주기(프레임)에 한 번만 계산
    const handleScroll = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    // 섹션 데이터가 늦게 도착해 높이가 바뀌는 경우도 반영
    window.addEventListener('resize', handleScroll);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [location.pathname]);

  // 페이지(주소)가 바뀌면 모바일 메뉴 닫기
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // 모바일 메뉴가 열려 있을 때 Esc로 닫기
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className="navbar"
      aria-label="주요 메뉴"
    >
      <div className="navbar-inner">
        <Link
          to="/"
          className="navbar-logo"
          onClick={handleMenuClick}
        >
          YEJIN
        </Link>

        {/* Desktop / Mobile 메뉴 */}
        <div
          id="navbar-menu"
          className={`navbar-links ${
            isMenuOpen ? 'is-open' : ''
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            return (
              /*
                <a href="/#about">는 다른 페이지(프로젝트 상세 등)에서 누르면
                사이트 전체를 새로 불러온다. (무료 서버라 데이터도 다시 받아서 느림)
                Link로 이동하고, 해당 섹션으로의 스크롤은 ScrollToHash가 처리한다.
              */
              <Link
                key={item.id}
                to={{ pathname: '/', hash: `#${item.id}` }}
                className={isActive ? 'active' : ''}
                aria-current={isActive ? 'location' : undefined}
                onClick={handleMenuClick}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* 모바일 메뉴 버튼 */}
        <button
          type="button"
          className={`navbar-menu-button ${
            isMenuOpen ? 'is-open' : ''
          }`}
          onClick={() =>
            setIsMenuOpen((prev) => !prev)
          }
          aria-label={
            isMenuOpen ? '메뉴 닫기' : '메뉴 열기'
          }
          aria-expanded={isMenuOpen}
          aria-controls="navbar-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
