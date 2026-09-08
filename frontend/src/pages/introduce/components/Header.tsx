function Header() {
  return (
    <header className="header">
      <nav className="header-nav">
        <a href="/" className="header-logo">
          $ yejin.dev
        </a>

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