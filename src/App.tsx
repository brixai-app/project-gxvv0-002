import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import { AppProvider, useAuth } from './context/AppContext';
import AppLayout from './components/AppLayout';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import { Role } from './types';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRoles?: Role[];
}

function ProtectedRoute({ children = null, requiredRoles = [] }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F6F8FB]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#003366] border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location?.pathname !== '/login') {
      toast.error('Please sign in to access the library.');
    }
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && user?.role && !requiredRoles.includes(user.role)) {
    toast.error('You do not have permission to view this section.');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location?.pathname ?? 'root'}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="h-full"
      >
        <Routes location={location}>
          <Route
            path="/login"
            element={
              <div className="min-h-screen bg-[#F6F8FB]">
                <Login />
              </div>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Catalog />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: 14,
              fontFamily: 'Inter, system-ui, sans-serif',
            },
          }}
        />
        <AnimatedRoutes />
      </HashRouter>
    </AppProvider>
  );
}

export default App;