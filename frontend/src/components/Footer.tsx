function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">
            YEJIN
          </span>

          <p className="footer-description">
            Developer
          </p>
        </div>

        <div className="footer-meta">
          <p>Built with React & Kotlin</p>
          <p>© {currentYear} YEJIN</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;