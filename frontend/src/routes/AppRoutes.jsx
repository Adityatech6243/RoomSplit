import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppShell } from '../components/layout/AppShell';

// Public Pages — eagerly loaded for fast initial paint
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// Protected Pages — lazy-loaded to reduce initial bundle
const DashboardPage     = lazy(() => import('../pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })));
const ExpensesPage      = lazy(() => import('../pages/expenses/ExpensesPage').then(m => ({ default: m.ExpensesPage })));
const ExpenseCreatePage = lazy(() => import('../pages/expenses/ExpenseCreatePage').then(m => ({ default: m.ExpenseCreatePage })));
const ExpenseDetailPage = lazy(() => import('../pages/expenses/ExpenseDetailPage').then(m => ({ default: m.ExpenseDetailPage })));
const ExpenseEditPage   = lazy(() => import('../pages/expenses/ExpenseEditPage').then(m => ({ default: m.ExpenseEditPage })));
const BalancesPage      = lazy(() => import('../pages/balances/BalancesPage').then(m => ({ default: m.BalancesPage })));
const SettlementsPage   = lazy(() => import('../pages/settlements/SettlementsPage').then(m => ({ default: m.SettlementsPage })));
const RoomMembersPage   = lazy(() => import('../pages/room/RoomMembersPage').then(m => ({ default: m.RoomMembersPage })));
const RoomsPage         = lazy(() => import('../pages/room/RoomsPage').then(m => ({ default: m.RoomsPage })));
const RoomSettingsPage  = lazy(() => import('../pages/room/RoomSettingsPage').then(m => ({ default: m.RoomSettingsPage })));
const ProfilePage       = lazy(() => import('../pages/profile/ProfilePage').then(m => ({ default: m.ProfilePage })));
const MorePage          = lazy(() => import('../pages/more/MorePage').then(m => ({ default: m.MorePage })));
const NotFoundPage      = lazy(() => import('../pages/system/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing & Auth Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Onboarding Route (redirects to unified dashboard) */}
      <Route
        path="/onboarding"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Main Authenticated Application Routes (inside AppShell layout) */}
      <Route
        element={
          <ProtectedRoute>
            <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontSize:'1rem',color:'#888'}}>Loading…</div>}>
              <AppShell />
            </Suspense>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/expenses/new" element={<ExpenseCreatePage />} />
        <Route path="/expenses/:id" element={<ExpenseDetailPage />} />
        <Route path="/expenses/:id/edit" element={<ExpenseEditPage />} />
        <Route path="/balances" element={<BalancesPage />} />
        <Route path="/settlements" element={<SettlementsPage />} />
        <Route path="/members" element={<RoomMembersPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/room-settings" element={<RoomSettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/more" element={<MorePage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
