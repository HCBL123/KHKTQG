// src/App.tsx - Updated routes
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Navigation from './components/Navigation';
import LoadingSpinner from './components/common/LoadingSpinner';
import AuthDebug from './components/AuthDebug';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Lazy load patient pages
const PatientProfile = lazy(() => import('./pages/patient/PatientProfile'));
const PatientExercises = lazy(() => import('./pages/patient/PatientExercises'));
const PatientSchedule = lazy(() => import('./pages/patient/PatientSchedule'));
const PatientSettings = lazy(() => import('./pages/patient/PatientSettings'));
const DoctorDashboard = lazy(() => import('./pages/DoctorDashboard'));
const ExercisePage = lazy(() => import('./pages/ExercisePage'));

function App() {
  return (
    <Router>
      <AuthProvider>
        <AuthDebug />
        <Layout>
          <Navigation />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Patient Routes */}
              <Route path="/patient/profile" element={<PatientProfile />} />
              <Route path="/patient/exercises" element={<PatientExercises />} />
              <Route path="/patient/schedule" element={<PatientSchedule />} />
              <Route path="/patient/settings" element={<PatientSettings />} />

              {/* Doctor Routes */}
              <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
              <Route path="/exercise/:id" element={<ExercisePage />} />
            </Routes>
          </Suspense>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
