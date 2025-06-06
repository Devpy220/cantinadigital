import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import EventPage from './pages/EventPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import OrderSuccessPage from './pages/OrderSuccessPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/event/:eventId" element={<EventPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/success" element={<OrderSuccessPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;