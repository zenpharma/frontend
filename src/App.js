import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DrugCatalog from './pages/DrugCatalog';
import Inventory from './pages/Inventory';
import Manufacturing from './pages/Manufacturing';
import QualityControl from './pages/QualityControl';
import Suppliers from './pages/Suppliers';
import Distribution from './pages/Distribution';
import Reports from './pages/Reports';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="drugs" element={<DrugCatalog />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="manufacturing" element={<Manufacturing />} />
          <Route path="qc" element={<QualityControl />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="distribution" element={<Distribution />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
