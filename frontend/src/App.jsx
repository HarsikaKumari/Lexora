import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import ClientDashboard from './pages/ClientDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import AdminPanel from './pages/AdminPanel';
import DocumentsPage from './pages/DocumentsPage';
import DocumentGenerator from './pages/DocumentGenerator';
import DocumentViewer from './pages/DocumentViewer';
import BookingPage from './pages/BookingPage';
import Home from './pages/HomePage';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className='flex justify-center items-center h-screen'>
        Loading...
      </div>
    );
  if (!user) return <Navigate to='/login' />;
  if (roles && !roles.includes(user.role)) return <Navigate to='/' />;
  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to='/login' />;
  if (user.role === 'admin') return <Navigate to='/admin' />;
  if (user.role === 'lawyer') return <Navigate to='/lawyer' />;
  return <Navigate to='/client' />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className='min-h-screen bg-gray-50'>
          <Routes>
            <Route
              path='/'
              element={<Home />}
            />

            <Route
              path='/login'
              element={<Login />}
            />
            <Route
              path='/register'
              element={<Register />}
            />
            <Route
              path='/documents'
              element={
                <PrivateRoute roles={['client']}>
                  <DocumentsPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/documents/generate'
              element={
                <PrivateRoute roles={['client']}>
                  <DocumentGenerator />
                </PrivateRoute>
              }
            />
            <Route
              path='/documents/:id'
              element={
                <PrivateRoute roles={['client']}>
                  <DocumentViewer />
                </PrivateRoute>
              }
            />

            <Route
              path='/services'
              element={<Services />}
            />
            <Route
              path='/book/:serviceId'
              element={
                <PrivateRoute roles={['client']}>
                  <BookingPage />
                </PrivateRoute>
              }
            />
            <Route
              path='/client'
              element={
                <PrivateRoute roles={['client']}>
                  <ClientDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path='/lawyer'
              element={
                <PrivateRoute roles={['lawyer']}>
                  <LawyerDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path='/admin'
              element={
                <PrivateRoute roles={['admin']}>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
