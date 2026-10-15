import { useEffect, useState } from 'react';
import { Link } from 'react-router';

function Header() {
  // 스크롤을 내리면 헤더에 배경을 깔아서 아래 내용과 겹쳐 보이지 않게 한다
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };

    // 새로고침했을 때 이미 스크롤된 위치일 수 있으므로 한 번 바로 확인
    handleScroll();

    window.addEventListener('scroll', handleScroll, {
      passive: true
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`header ${isScrolled ? 'is-scrolled' : ''}`}
    >
      <nav
        className="header-nav"
        aria-label="주요 메뉴"
      >
        {/* 페이지 전체를 새로 불러오지 않도록 Link 사용 */}
        <Link to="/" className="header-logo">
          $ yejin.dev
        </Link>

        <div className="header-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>
    </header>
  );
}

export default Header;
