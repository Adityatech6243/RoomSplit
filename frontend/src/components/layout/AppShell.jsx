import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { MobileNav } from './MobileNav';

export const AppShell = () => {
  return (
    <div className="mobile-app-shell">
      <Header />
      <main className="app-main-content">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  );
};
