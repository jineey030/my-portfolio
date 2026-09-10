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
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/todos"
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
            Todos
          </NavLink>

          <NavLink
            to="/admin/study-logs"
            className={({ isActive }) =>
              isActive ? 'active' : ''
            }
          >
            Study Logs
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
