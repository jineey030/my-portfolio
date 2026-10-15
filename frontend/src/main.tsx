import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import './App.css'

import './pages/introduce/introduce.css'
import './pages/project/ProjectDetail.css'
import './pages/learning/Workspace.css'
import './pages/not-found/NotFound.css'
import './pages/admin/Admin.css'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
