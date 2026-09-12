import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './services/auth.jsx';
import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';
import SchemesPage from './pages/SchemesPage.jsx';
import SavedSchemesPage from './pages/SavedSchemesPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<App />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
            <Route path="/career-roadmap" element={<RoadmapPage />} />
            <Route path="/government-schemes" element={<SchemesPage />} />
            <Route path="/government-schemes/saved" element={<SavedSchemesPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<LandingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
