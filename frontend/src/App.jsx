import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; //[cite: 10]
import Login from './pages/Login'; //[cite: 10]
import AdminDashboard from './pages/AdminDashboard'; //[cite: 10]
import StaffDashboard from './pages/StaffDashboard'; //[cite: 10]
import StudentDashboard from './pages/StudentDashboard'; //[cite: 10]
import ProtectedRoute from './components/ProtectedRoute'; //[cite: 10]
import Layout from './components/Layout';

export default function App() { //[cite: 10]
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/staff" 
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <Layout>
                <StaffDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/student" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Layout>
                <StudentDashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}