import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ArticleFormPage from './pages/ArticleFormPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="page-layout">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'var(--font-body)',
                fontSize: 14,
                borderRadius: 8,
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-md)',
              },
              success: { iconTheme: { primary: '#059669', secondary: 'white' } },
              error: { iconTheme: { primary: '#dc2626', secondary: 'white' } },
            }}
          />
          <Routes>
            {/* Auth pages without navbar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Main pages with navbar */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/articles/:id" element={<ArticleDetailPage />} />
                  <Route path="/articles/new" element={
                    <ProtectedRoute><ArticleFormPage /></ProtectedRoute>
                  } />
                  <Route path="/articles/:id/edit" element={
                    <ProtectedRoute><ArticleFormPage /></ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute><DashboardPage /></ProtectedRoute>
                  } />
                </Routes>
              </>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
