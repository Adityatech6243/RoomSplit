import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AppShell } from '../components/layout/AppShell';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// Protected Pages
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ExpensesPage } from '../pages/expenses/ExpensesPage';
import { ExpenseCreatePage } from '../pages/expenses/ExpenseCreatePage';
import { ExpenseDetailPage } from '../pages/expenses/ExpenseDetailPage';
import { ExpenseEditPage } from '../pages/expenses/ExpenseEditPage';
import { BalancesPage } from '../pages/balances/BalancesPage';
import { SettlementsPage } from '../pages/settlements/SettlementsPage';
import { RoomMembersPage } from '../pages/room/RoomMembersPage';
import { RoomsPage } from '../pages/room/RoomsPage';
import { RoomSettingsPage } from '../pages/room/RoomSettingsPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { MorePage } from '../pages/more/MorePage';
import { NotFoundPage } from '../pages/system/NotFoundPage';

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
            <AppShell />
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
