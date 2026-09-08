import { Routes, Route, BrowserRouter } from 'react-router';
import './App.css';

// import page
import Introduce from './pages/introduce/pages';
import ProjectDetail from './pages/project/ProjectDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Introduce />} />

        <Route
          path="/projects/:projectId"
          element={<ProjectDetail />}
        />

        <Route
          path="*"
          element={<div>페이지를 찾을 수 없습니다.</div>}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
