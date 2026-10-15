import {
  Link,
  NavLink,
  Outlet,
  useNavigate
} from 'react-router';

// CSS는 main.tsx에서 한 번에 불러온다. (Admin.css, LearningTracker.css)

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');

    navigate('/admin/login', {
      replace: true
    });
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">

        <div className="admin-sidebar-header">
          <p>ADMIN</p>
          <span>Learning Manager</span>
        </div>

        {/*
          NavLink는 현재 경로와 일치하면 'active' 클래스를 자동으로 붙인다.
          그래서 className 함수는 따로 넘기지 않는다.
        */}
        <nav className="admin-nav">

          {/* Portfolio */}
          <div className="admin-nav-section">
            <p className="admin-nav-section-title">
              PORTFOLIO
            </p>

            <NavLink to="/admin/portfolio" end>
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>

              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/portfolio/profile">
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="3" />
                <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" />
              </svg>

              <span>Profile</span>
            </NavLink>

            <NavLink to="/admin/portfolio/projects">
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M8 5V3h8v2" />
                <path d="M3 10h18" />
              </svg>

              <span>Projects</span>
            </NavLink>
          </div>

          {/* Workspace */}
          <div className="admin-nav-section">
            <p className="admin-nav-section-title">
              WORKSPACE
            </p>

            <NavLink to="/admin" end>
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>

              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/admin/todos">
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12l4 4L19 6" />
              </svg>

              <span>Todos</span>
            </NavLink>

            <NavLink to="/admin/study-logs">
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 7h8" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
              </svg>

              <span>Study Logs</span>
            </NavLink>
          </div>

          {/* Settings */}
          <div className="admin-nav-section">
            <p className="admin-nav-section-title">
              SYSTEM
            </p>

            <NavLink to="/admin/settings">
              <svg
                className="admin-nav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.41 1.41-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2v-.49a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.41-1.41.06-.06A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.03H7v-2h.84A1.7 1.7 0 0 0 9.4 11a1.7 1.7 0 0 0-.34-1.88L9 9.06l1.41-1.41.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.38 6.5V6h2v.5a1.7 1.7 0 0 0 1.03 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.41 1.41-.06.06A1.7 1.7 0 0 0 19.4 11a1.7 1.7 0 0 0 1.56 1.03H21v2h-.04A1.7 1.7 0 0 0 19.4 15Z" />
              </svg>

              <span>Settings</span>
            </NavLink>
          </div>

        </nav>

        <div className="admin-sidebar-footer">
          {/* 메뉴가 아니라 바깥으로 나가는 링크라서 NavLink 대신 Link 사용 */}
          <Link to="/">
            ← View Portfolio
          </Link>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            ← Sign Out
          </button>
        </div>

      </aside>

      {/*
        각 화면이 이미 <main className="admin-page">를 가지고 있으므로
        여기서는 <div>를 사용한다. (<main>은 페이지에 하나만 있어야 함)
      */}
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
