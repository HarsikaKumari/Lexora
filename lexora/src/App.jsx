import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './auth/login';
import SignUpPage from './auth/signUp';
import Dashboard from './components/client-dashboard';

function App() {
  return (
    <Routes>
      <Route
        path='/'
        element={<LoginPage />}
      />
      <Route
        path='/signup'
        element={<SignUpPage />}
      />
      <Route
        path='/dashboard'
        element={<Dashboard />}
      />
    </Routes>
  );
}

export default App;
