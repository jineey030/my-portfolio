import { Routes, Route, BrowserRouter } from 'react-router';
import './App.css';

// pages
import Introduce from './pages/introduce/pages';
import ProjectDetail from './pages/project/ProjectDetail';
import LearningTracker from './pages/learning/LearningTracker';
import NotFound from './pages/not-found/NotFound';

// components
import Navbar from './components/Navbar';
import ScrollToHash from './components/ScrollToHash';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
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

        {/* Tracker */}
        <Route
          path="/learning"
          element={<LearningTracker />}
        />

        {/* 존재하지 않는 페이지 */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
