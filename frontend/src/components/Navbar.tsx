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
  const location = useLocation();

  useEffect(() => {
    // 프로젝트 상세 페이지에서는 active 상태 제거
    if (location.pathname !== '/') {
      setActiveSection('');
      return;
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      const pageBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;

      // 페이지 맨 아래까지 내려왔다면 Contact 활성화
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

    // 처음 페이지에 들어왔을 때도 실행
    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          YEJIN
        </Link>

        <div className="navbar-links">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`/#${item.id}`}
              className={
                activeSection === item.id
                  ? 'active'
                  : ''
              }
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
