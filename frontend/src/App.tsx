import {
  Routes,
  Route,
  BrowserRouter,
  useLocation
} from 'react-router';

// pages
import Introduce from './pages/introduce/pages';
import ProjectDetail from './pages/project/ProjectDetail';

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
import WelcomeNotice from './components/WelcomeNotice';
import ServerStatusBanner from './components/ServerStatusBanner';
import { useWarmUpAiServer } from './hooks/useWarmUpAiServer';

// context
// (공개 Learning 페이지는 삭제했지만, 관리자 Workspace 화면들이 이 Context를 쓴다)
import { LearningProvider } from './pages/learning/context/LearningContext';

function AppContent() {
  const location = useLocation();

  // '/admin' 또는 '/admin/...'만 관리자 화면으로 본다.
  // (startsWith('/admin')만 쓰면 '/administrator' 같은 주소도 관리자로 판단됨)
  const isAdmin =
    location.pathname === '/admin' ||
    location.pathname.startsWith('/admin/');

  useWarmUpAiServer(!isAdmin);

  return (
    <>
      {!isAdmin && <ServerStatusBanner />}
      {!isAdmin && <WelcomeNotice />}

      {!isAdmin && <Navbar />}
      {!isAdmin && <ScrollToHash />}

      <LearningProvider>
        <Routes>
          {/* 메인 페이지 */}
          <Route
            path="/"
            element={<Introduce />}
          />

          {/* 프로젝트 상세 페이지 (주소의 값은 프로젝트 slug) */}
          <Route
            path="/projects/:projectId"
            element={<ProjectDetail />}
          />

          {/* 관리자 로그인 */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          {/* 관리자 (로그인 필요) */}
          <Route
            path="/admin"
            element={<AdminRoute />}
          >
            <Route element={<AdminLayout />}>
              <Route
                index
                element={<AdminDashboard />}
              />

              {/* portfolio */}
              <Route
                path="portfolio"
                element={<PortfolioDashboard />}
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
