import { Link, Outlet } from 'react-router';

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <p>ADMIN</p>
          <span>Learning Manager</span>
        </div>

        <nav className="admin-nav">
          <Link to="/admin">
            Dashboard
          </Link>

          <Link to="/admin/todos">
            Todos
          </Link>

          <Link to="/admin/study-logs">
            Study Logs
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/learning">
            ← View Portfolio
          </Link>
        </div>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;