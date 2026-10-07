function PortfolioDashboard() {
  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <p className="admin-page-label">
          ADMIN / PORTFOLIO
        </p>

        <h1>Portfolio Management</h1>

        <p className="admin-page-description">
          포트폴리오에 표시되는 콘텐츠를 관리합니다.
        </p>
      </header>

      <section className="admin-dashboard-grid">
        <div className="admin-dashboard-card">
          <p className="admin-dashboard-card-label">
            PROFILE
          </p>

          <h2>Profile</h2>

          <p>
            이름, 소개, 연락처 등 포트폴리오 프로필을 관리합니다.
          </p>
        </div>

        <div className="admin-dashboard-card">
          <p className="admin-dashboard-card-label">
            PROJECTS
          </p>

          <h2>Projects</h2>

          <p>
            포트폴리오에 표시할 프로젝트를 관리합니다.
          </p>
        </div>

        <div className="admin-dashboard-card">
          <p className="admin-dashboard-card-label">
            SKILLS
          </p>

          <h2>Skills</h2>

          <p>
            포트폴리오 전체 기술 스택을 관리합니다.
          </p>
        </div>

        <div className="admin-dashboard-card">
          <p className="admin-dashboard-card-label">
            CONTENT
          </p>

          <h2>Project Content</h2>

          <p>
            프로젝트의 Features, Challenges, Technical Highlights를 관리합니다.
          </p>
        </div>
      </section>
    </main>
  );
}

export default PortfolioDashboard;