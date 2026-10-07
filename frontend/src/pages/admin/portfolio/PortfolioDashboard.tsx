import { useNavigate } from 'react-router';

function PortfolioDashboard() {
  const navigate = useNavigate();

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

      <section className="admin-management-list">

        <button
          type="button"
          className="admin-management-item"
          onClick={() =>
            navigate('/admin/portfolio/profile')
          }
        >
          <div className="admin-management-content">
            <p className="admin-management-label">
              PROFILE
            </p>

            <h2>Profile</h2>

            <p>
              이름, 소개, 연락처 등 포트폴리오 프로필을 관리합니다.
            </p>
          </div>

          <span className="admin-management-arrow">
            →
          </span>
        </button>

        <button
          type="button"
          className="admin-management-item"
          onClick={() =>
            navigate('/admin/portfolio/projects')
          }
        >
          <div className="admin-management-content">
            <p className="admin-management-label">
              PROJECTS
            </p>

            <h2>Projects</h2>

            <p>
              프로젝트와 Skills, Features, Challenges,
              Technical Highlights를 관리합니다.
            </p>
          </div>

          <span className="admin-management-arrow">
            →
          </span>
        </button>

      </section>
    </main>
  );
}

export default PortfolioDashboard;
