function Hero() {
  return (
    <section id="hero" className="hero">
      <p className="hero-greeting">$ whoami</p>
      <h1 className="hero-name">오예진</h1>
      <p className="hero-tagline">
        React와 Kotlin으로 <span className="highlight-cyan">배우고</span>,{' '}
        <span className="highlight-purple">만들면서</span> 성장하는 개발자
      </p>
      <div className="hero-cta">
        <a href="#projects" className="btn-primary">
          프로젝트 보기
        </a>
        <a href="#contact" className="btn-outline">
          연락하기
        </a>
      </div>
    </section>
  );
}

export default Hero;