import { Routes, Route, BrowserRouter } from 'react-router';
import './App.css';

// pages
import Introduce from './pages/introduce/pages';
import ProjectDetail from './pages/project/ProjectDetail';

// components
import ScrollToHash from './pages/project/components/ScrollToHash';

function App() {
  return (
    <BrowserRouter>
      {/* hash 기반 스크롤 처리 */}
      <ScrollToHash />

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

        {/* 존재하지 않는 페이지 */}
        <Route
          path="*"
          element={
            <div>
              페이지를 찾을 수 없습니다.
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
