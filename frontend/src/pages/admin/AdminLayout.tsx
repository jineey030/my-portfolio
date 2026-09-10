import { NavLink, Outlet } from 'react-router';
import '../learning/LearningTracker.css';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <p>ADMIN</p>
          <span>Learning Manager</span>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
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

          <NavLink
            to="/admin/todos"
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
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

          <NavLink
            to="/admin/study-logs"
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
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
        </nav>

        <div className="admin-sidebar-footer">
          <NavLink to="/">
            ← View Portfolio
          </NavLink>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
