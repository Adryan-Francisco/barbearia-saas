import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './global.css';
import Login from './pages/Login';
import Register from './pages/Register';
import Appointments from './pages/Appointments';
import NewAppointment from './pages/NewAppointment';
import BarbershopLogin from './pages/BarbershopLogin';
import BarbershopDashboard from './pages/BarbershopDashboard';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const isBarbershopAuthenticated = !!localStorage.getItem('barbershop_id');

  return (
    <Router>
      {isAuthenticated && !window.location.pathname.includes('/barbershop') && <Header />}
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
          path="/barbershop/dashboard"
          element={
            isBarbershopAuthenticated ? <BarbershopDashboard /> : <Navigate to="/barbershop/login" />
          }
        />

        <Route path="/" element={<Navigate to="/appointments" />} />
      </Routes>
    </Router>
  );
}

export default App;
