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
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTodos from './pages/admin/AdminTodos';
import AdminStudyLogs from './pages/admin/AdminStudyLogs';

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
            element={<AdminLayout />}
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="todos"
              element={<AdminTodos />}
            />

            <Route
              path="study-logs"
              element={<AdminStudyLogs />}
            />
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
