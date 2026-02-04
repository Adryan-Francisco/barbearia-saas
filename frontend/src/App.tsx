import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './global.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Appointments from './pages/Appointments';
import NewAppointment from './pages/NewAppointment';
import BarbershopLogin from './pages/BarbershopLogin';
import BarbershopDashboard from './pages/BarbershopDashboard';
import { ClientHistory } from './pages/ClientHistory';
import { Analytics } from './pages/Analytics';
import { Payments } from './pages/Payments';
import { RealtimeDashboard } from './pages/RealtimeDashboard';
import { AdvancedCharts } from './pages/AdvancedCharts';
import Header from './components/Header';
import BarbershopHeader from './components/BarbershopHeader';
import NotificationCenter from './components/NotificationCenter';
import ProtectedRoute from './components/ProtectedRoute';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const isBarbershopAuthenticated = !!localStorage.getItem('barbershop_id');
  
  // Usar o hook WebSocket
  const {
    notifications,
    clearNotification,
    clearAllNotifications,
  } = useWebSocket({
    enabled: isAuthenticated || isBarbershopAuthenticated,
  });

  return (
    <Router>
      {isAuthenticated && !isBarbershopAuthenticated && !window.location.pathname.includes('/barbershop') && <Header />}
      {isBarbershopAuthenticated && <BarbershopHeader />}
      
      {/* Notification Center */}
      <NotificationCenter
        notifications={notifications}
        onClear={clearNotification}
        onClearAll={clearAllNotifications}
      />
      
      <Routes>
        {/* Rotas do Cliente */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-appointment"
          element={
            <ProtectedRoute>
              <NewAppointment />
            </ProtectedRoute>
          }
        />

        {/* Rotas da Barbearia */}
        <Route path="/barbershop/login" element={<BarbershopLogin />} />
        <Route
          path="/barbershop-dashboard"
          element={
            isBarbershopAuthenticated ? <BarbershopDashboard /> : <Navigate to="/barbershop/login" />
          }
        />
        <Route
          path="/client-history"
          element={
            isBarbershopAuthenticated ? <ClientHistory /> : <Navigate to="/barbershop/login" />
          }
        />
        <Route
          path="/analytics"
          element={
            isBarbershopAuthenticated ? <Analytics /> : <Navigate to="/barbershop/login" />
          }
        />
        <Route
          path="/payments"
          element={
            isBarbershopAuthenticated ? <Payments /> : <Navigate to="/barbershop/login" />
          }
        />
        <Route
          path="/realtime-dashboard"
          element={
            isBarbershopAuthenticated ? <RealtimeDashboard /> : <Navigate to="/barbershop/login" />
          }
        />
        <Route
          path="/charts"
          element={
            isBarbershopAuthenticated ? <AdvancedCharts /> : <Navigate to="/barbershop/login" />
          }
        />

        <Route path="/" element={<Navigate to="/appointments" />} />
      </Routes>
    </Router>
  );
}

export default App;
