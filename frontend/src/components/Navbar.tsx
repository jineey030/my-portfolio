import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

function Navbar() {
  const [activeSection, setActiveSection] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;

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

    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
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
          className={`navbar-links ${
            isMenuOpen ? 'is-open' : ''
          }`}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              className={
                activeSection === item.id
                  ? 'active'
                  : ''
              }
              onClick={handleMenuClick}
            >
              {item.label}
            </a>
          ))}
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
