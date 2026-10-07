import {
  Routes,
  Route,
  BrowserRouter,
  useLocation
} from 'react-router';

import './App.css';

// pages
import Introduce from './pages/introduce/pages';
import ProjectDetail from './pages/project/ProjectDetail';
import Learning from './pages/learning/Learning';

import AdminLogin from './pages/admin/AdminLogin';
import AdminRoute from './pages/admin/AdminRoute';

import PortfolioDashboard from './pages/admin/portfolio/PortfolioDashboard';
import PortfolioProfile from './pages/admin/portfolio/PortfolioProfile';
import PortfolioProjects from './pages/admin/portfolio/PortfolioProjects';

import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/workspace/WorkspaceDashboard';
import AdminTodos from './pages/admin/workspace/WorkspaceTodos';
import AdminStudyLogs from './pages/admin/workspace/WorkspaceStudyLogs';
import AdminSettings from './pages/admin/AdminSettings';

import NotFound from './pages/not-found/NotFound';

// components
import Navbar from './components/Navbar';
import ScrollToHash from './components/ScrollToHash';
import Footer from './components/Footer';

// context
import { LearningProvider } from './pages/learning/context/LearningContext';


function AppContent() {
  const location = useLocation();

  const isAdmin =
    location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdmin && <Navbar />}

      {!isAdmin && <ScrollToHash />}

      <LearningProvider>
        <Routes>
          {/* 메인 페이지 */}
          <Route
            path="/"
            element={<Introduce />}
          />

          {/* 프로젝트 상세 페이지 */}
          <Route
            path="/projects/:projectId"
            element={<ProjectDetail />}
          />

          {/* 공개 Learning */}
          <Route
            path="/learning"
            element={<Learning />}
          />

          {/* 관리자 로그인 */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* 관리자 */}
          <Route
            path="/admin"
            element={<AdminRoute />}
          >
            <Route
              element={<AdminLayout />}
            >
              <Route
                index
                element={<AdminDashboard />}
              />

              {/* portfolio */}
              <Route 
                path="portfolio" element={<PortfolioDashboard />} 
              />

              <Route
                path="portfolio/profile"
                element={<PortfolioProfile />}
              />

              <Route
                path="portfolio/projects"
                element={<PortfolioProjects />}
              />

              {/* workspace */}
              <Route
                path="todos"
                element={<AdminTodos />}
              />

              <Route
                path="study-logs"
                element={<AdminStudyLogs />}
              />

              <Route
                path="settings"
                element={<AdminSettings />}
              />
            </Route>
          </Route>

          {/* 존재하지 않는 페이지 */}
          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </LearningProvider>

      {!isAdmin && <Footer />}
    </>
  );
}


function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
