import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { CheckDisease } from './pages/CheckDisease';
import { ConsultDoctor } from './pages/ConsultDoctor';
import { ConsultationHistory } from './pages/ConsultationHistory';
import { ConsultationRoom } from './pages/ConsultationRoom';
import { RefreshCw } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-500">
        <RefreshCw className="h-8 w-8 animate-spin text-sky-400" />
        <span className="text-sm font-semibold tracking-wide uppercase">Syncing HealthBridge portal...</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col text-slate-105 font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route 
            path="/signin" 
            element={
              user ? (
                user.is_superuser ? <Navigate to="/admin-dashboard" replace /> :
                user.is_doctor ? <Navigate to="/doctor-dashboard" replace /> :
                <Navigate to="/patient-dashboard" replace />
              ) : (
                <SignIn />
              )
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              user ? <Navigate to="/" replace /> : <SignUp />
            } 
          />

          {/* Role specific Dashboards */}
          <Route 
            path="/patient-dashboard" 
            element={
              user?.is_patient ? <PatientDashboard /> : <Navigate to="/signin" replace />
            } 
          />
          <Route 
            path="/doctor-dashboard" 
            element={
              user?.is_doctor ? <DoctorDashboard /> : <Navigate to="/signin" replace />
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              user?.is_superuser ? <AdminDashboard /> : <Navigate to="/signin" replace />
            } 
          />

          {/* Interactive Pages */}
          <Route 
            path="/check-disease" 
            element={
              user?.is_patient ? <CheckDisease /> : <Navigate to="/signin" replace />
            } 
          />
          <Route 
            path="/consult-doctor" 
            element={
              user?.is_patient ? <ConsultDoctor /> : <Navigate to="/signin" replace />
            } 
          />
          <Route 
            path="/consultations" 
            element={
              user ? <ConsultationHistory /> : <Navigate to="/signin" replace />
            } 
          />
          <Route 
            path="/consultation/:id" 
            element={
              user ? <ConsultationRoom /> : <Navigate to="/signin" replace />
            } 
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;